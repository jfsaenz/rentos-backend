import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
  ) {}

  async create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    // Verificar documento duplicado
    const existing = await this.clienteRepository.findOne({
      where: { numeroDocumento: createClienteDto.numeroDocumento },
    });

    if (existing) {
      throw new ConflictException('Ya existe un cliente con este número de documento');
    }

    const cliente = this.clienteRepository.create({
      ...createClienteDto,
      score: 100,
      reservasTotales: 0,
      totalGastado: 0,
      cancelaciones: 0,
    });

    return await this.clienteRepository.save(cliente);
  }

  async findAll(tenantId?: string): Promise<Cliente[]> {
    const where = tenantId ? { tenantId } : {};
    return await this.clienteRepository.find({ where });
  }

  async findOne(id: string): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOne({ where: { id } });
    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
    return cliente;
  }

  async update(id: string, updateClienteDto: UpdateClienteDto): Promise<Cliente> {
    await this.clienteRepository.update(id, updateClienteDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.clienteRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
  }

  async search(query: string, tenantId?: string): Promise<Cliente[]> {
    const where: any = tenantId ? { tenantId } : {};
    
    return await this.clienteRepository
      .createQueryBuilder('cliente')
      .where(where)
      .andWhere(
        '(cliente.nombre ILIKE :query OR cliente.numeroDocumento LIKE :query OR cliente.telefono LIKE :query OR cliente.email ILIKE :query)',
        { query: `%${query}%` },
      )
      .getMany();
  }

  async updateScore(id: string): Promise<Cliente> {
    const cliente = await this.findOne(id);
    const score = this.calculateScore(cliente.reservasTotales, cliente.cancelaciones);
    await this.clienteRepository.update(id, { score });
    return this.findOne(id);
  }

  private calculateScore(reservasTotales: number, cancelaciones: number): number {
    const score = 100 - (cancelaciones * 10) + (Math.min(reservasTotales, 10) * 5);
    return Math.max(0, Math.min(100, score));
  }
}
