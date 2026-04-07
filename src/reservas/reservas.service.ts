import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Reserva } from './entities/reserva.entity';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';

@Injectable()
export class ReservasService {
  constructor(
    @InjectRepository(Reserva)
    private reservaRepository: Repository<Reserva>,
  ) {}

  async create(createReservaDto: CreateReservaDto): Promise<Reserva> {
    // Verificar disponibilidad
    const disponible = await this.verificarDisponibilidad(
      createReservaDto.vehiculoId,
      createReservaDto.fechaInicio,
      createReservaDto.fechaFin,
      undefined,
      createReservaDto.tenantId,
    );

    if (!disponible.disponible) {
      throw new BadRequestException('El vehículo no está disponible en las fechas seleccionadas');
    }

    const reserva = this.reservaRepository.create({
      ...createReservaDto,
      estado: 'confirmada',
      pago: createReservaDto.pago || {
        metodoPago: 'efectivo',
        estado: 'procesado',
        fechaOperacion: new Date().toISOString(),
        referencia: `TXN-${Date.now()}`,
      },
    });

    return await this.reservaRepository.save(reserva);
  }

  async findAll(tenantId?: string): Promise<Reserva[]> {
    const where = tenantId ? { tenantId } : {};
    return await this.reservaRepository.find({
      where,
      relations: ['vehiculo', 'cliente'],
      order: { createdAt: 'DESC' },
    });
  }

  async findActivas(tenantId?: string): Promise<Reserva[]> {
    const where: any = { estado: 'confirmada' };
    if (tenantId) where.tenantId = tenantId;

    const hoy = new Date().toISOString().split('T')[0];
    
    return await this.reservaRepository
      .createQueryBuilder('reserva')
      .where(where)
      .andWhere('reserva.fechaInicio <= :hoy', { hoy })
      .andWhere('reserva.fechaFin >= :hoy', { hoy })
      .leftJoinAndSelect('reserva.vehiculo', 'vehiculo')
      .leftJoinAndSelect('reserva.cliente', 'cliente')
      .getMany();
  }

  async findOne(id: string): Promise<Reserva> {
    const reserva = await this.reservaRepository.findOne({
      where: { id },
      relations: ['vehiculo', 'cliente'],
    });

    if (!reserva) {
      throw new NotFoundException(`Reserva con ID ${id} no encontrada`);
    }

    return reserva;
  }

  async update(id: string, updateReservaDto: UpdateReservaDto): Promise<Reserva> {
    // Si se actualizan fechas, verificar disponibilidad
    if (updateReservaDto.fechaInicio || updateReservaDto.fechaFin) {
      const reserva = await this.findOne(id);
      const disponible = await this.verificarDisponibilidad(
        reserva.vehiculoId,
        updateReservaDto.fechaInicio || reserva.fechaInicio,
        updateReservaDto.fechaFin || reserva.fechaFin,
        id,
        reserva.tenantId,
      );

      if (!disponible.disponible) {
        throw new BadRequestException('El vehículo no está disponible en las nuevas fechas');
      }
    }

    await this.reservaRepository.update(id, updateReservaDto);
    return this.findOne(id);
  }

  async cancelar(id: string): Promise<Reserva> {
    await this.reservaRepository.update(id, { estado: 'cancelada' });
    return this.findOne(id);
  }

  async finalizar(id: string): Promise<Reserva> {
    await this.reservaRepository.update(id, { estado: 'finalizada' });
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.reservaRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Reserva con ID ${id} no encontrada`);
    }
  }

  async verificarDisponibilidad(
    vehiculoId: number,
    fechaInicio: string,
    fechaFin: string,
    excluirReservaId?: string,
    tenantId?: string,
  ): Promise<{ disponible: boolean; conflictos?: Reserva[] }> {
    const inicioSolicitud = new Date(fechaInicio).getTime();
    const finSolicitud = new Date(fechaFin).getTime();

    const query = this.reservaRepository
      .createQueryBuilder('reserva')
      .where('reserva.vehiculoId = :vehiculoId', { vehiculoId })
      .andWhere('reserva.estado != :estado', { estado: 'cancelada' });

    if (excluirReservaId) {
      query.andWhere('reserva.id != :excluirReservaId', { excluirReservaId });
    }

    if (tenantId) {
      query.andWhere('reserva.tenantId = :tenantId', { tenantId });
    }

    const reservas = await query.getMany();

    const conflictos = reservas.filter((res) => {
      const inicioRes = new Date(res.fechaInicio).getTime();
      const finRes = new Date(res.fechaFin).getTime();
      return inicioSolicitud <= finRes && finSolicitud >= inicioRes;
    });

    return {
      disponible: conflictos.length === 0,
      conflictos: conflictos.length > 0 ? conflictos : undefined,
    };
  }
}
