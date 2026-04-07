import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehiculo } from './entities/vehiculo.entity';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';

@Injectable()
export class VehiculosService {
  constructor(
    @InjectRepository(Vehiculo)
    private vehiculoRepository: Repository<Vehiculo>,
  ) {}

  async create(createVehiculoDto: CreateVehiculoDto): Promise<Vehiculo> {
    const vehiculo = this.vehiculoRepository.create(createVehiculoDto);
    return await this.vehiculoRepository.save(vehiculo);
  }

  async findAll(tenantId?: string): Promise<Vehiculo[]> {
    const where = tenantId ? { tenantId } : {};
    return await this.vehiculoRepository.find({ where });
  }

  async findOne(id: number): Promise<Vehiculo> {
    const vehiculo = await this.vehiculoRepository.findOne({ where: { id } });
    if (!vehiculo) {
      throw new NotFoundException(`Vehículo con ID ${id} no encontrado`);
    }
    return vehiculo;
  }

  async update(id: number, updateVehiculoDto: UpdateVehiculoDto): Promise<Vehiculo> {
    await this.vehiculoRepository.update(id, updateVehiculoDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.vehiculoRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Vehículo con ID ${id} no encontrado`);
    }
  }

  async findByEstado(estado: string, tenantId?: string): Promise<Vehiculo[]> {
    const where: any = { estado };
    if (tenantId) where.tenantId = tenantId;
    return await this.vehiculoRepository.find({ where });
  }

  async updateEstado(id: number, estado: string): Promise<Vehiculo> {
    await this.vehiculoRepository.update(id, { estado });
    return this.findOne(id);
  }
}
