import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tarifa } from './entities/tarifa.entity';
import { CreateTarifaDto } from './dto/create-tarifa.dto';
import { UpdateTarifaDto } from './dto/update-tarifa.dto';

@Injectable()
export class TarifasService {
  constructor(
    @InjectRepository(Tarifa)
    private tarifaRepository: Repository<Tarifa>,
  ) {}

  async create(createTarifaDto: CreateTarifaDto): Promise<Tarifa> {
    const tarifa = this.tarifaRepository.create(createTarifaDto);
    return await this.tarifaRepository.save(tarifa);
  }

  async findAll(tenantId?: string): Promise<Tarifa[]> {
    const where = tenantId ? { tenantId } : {};
    return await this.tarifaRepository.find({ where });
  }

  async findActivas(tenantId?: string): Promise<Tarifa[]> {
    const where: any = { activa: true };
    if (tenantId) where.tenantId = tenantId;
    return await this.tarifaRepository.find({ where });
  }

  async findOne(id: string): Promise<Tarifa> {
    const tarifa = await this.tarifaRepository.findOne({ where: { id } });
    if (!tarifa) {
      throw new NotFoundException(`Tarifa con ID ${id} no encontrada`);
    }
    return tarifa;
  }

  async update(id: string, updateTarifaDto: UpdateTarifaDto): Promise<Tarifa> {
    await this.tarifaRepository.update(id, updateTarifaDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.tarifaRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Tarifa con ID ${id} no encontrada`);
    }
  }

  async calcularPrecioFinal(
    precioBase: number,
    fechaInicio: string,
    fechaFin: string,
    vehiculoId?: number,
    tenantId?: string,
  ): Promise<{ precioFinal: number; tarifasAplicadas: any[] }> {
    let precioFinal = precioBase;
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const dias = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));

    const where: any = { activa: true };
    if (tenantId) where.tenantId = tenantId;

    const tarifas = await this.tarifaRepository.find({ where });
    const tarifasAplicadas = [];

    for (const tarifa of tarifas) {
      // Verificar si aplica al vehículo
      if (
        tarifa.vehiculosAplicables !== 'todos' &&
        vehiculoId &&
        Array.isArray(tarifa.vehiculosAplicables) &&
        !tarifa.vehiculosAplicables.includes(vehiculoId)
      ) {
        continue;
      }

      let aplicada = false;

      // Aplicar según tipo
      if (tarifa.tipo === 'descuento_largo' && dias >= 7) {
        precioFinal = precioFinal * (1 + Number(tarifa.porcentaje) / 100);
        aplicada = true;
      } else if (tarifa.tipo === 'fin_semana') {
        const esFinde =
          inicio.getDay() === 6 ||
          inicio.getDay() === 0 ||
          fin.getDay() === 6 ||
          fin.getDay() === 0;
        if (esFinde) {
          precioFinal = precioFinal * (1 + Number(tarifa.porcentaje) / 100);
          aplicada = true;
        }
      } else if (tarifa.tipo === 'temporada_alta' && tarifa.fechaInicio && tarifa.fechaFin) {
        const inicioTemp = new Date(tarifa.fechaInicio);
        const finTemp = new Date(tarifa.fechaFin);
        if (inicio <= finTemp && fin >= inicioTemp) {
          precioFinal = precioFinal * (1 + Number(tarifa.porcentaje) / 100);
          aplicada = true;
        }
      }

      if (aplicada) {
        tarifasAplicadas.push({
          nombre: tarifa.nombre,
          tipo: tarifa.tipo,
          porcentaje: tarifa.porcentaje,
        });
      }
    }

    return {
      precioFinal: Math.round(precioFinal * dias),
      tarifasAplicadas,
    };
  }
}
