import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from './entities/tenant.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
  ) {}

  async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
    const tenantId = `TEN-${Date.now()}`;
    
    // Determinar límite según plan
    const limites = {
      basico: 10,
      profesional: 30,
      empresarial: 100,
    };

    const tenant = this.tenantRepository.create({
      ...createTenantDto,
      tenantId,
      limiteVehiculos: limites[createTenantDto.plan],
      vehiculosRegistrados: 0,
    });

    return await this.tenantRepository.save(tenant);
  }

  async findAll(): Promise<Tenant[]> {
    return await this.tenantRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOne({ where: { id } });
    if (!tenant) {
      throw new NotFoundException(`Tenant con ID ${id} no encontrado`);
    }
    return tenant;
  }

  async update(id: string, updateTenantDto: UpdateTenantDto): Promise<Tenant> {
    await this.tenantRepository.update(id, updateTenantDto);
    return this.findOne(id);
  }

  async toggleEstado(id: string): Promise<Tenant> {
    const tenant = await this.findOne(id);
    const nuevoEstado = tenant.estado === 'activo' ? 'suspendido' : 'activo';
    await this.tenantRepository.update(id, { estado: nuevoEstado });
    return this.findOne(id);
  }

  async canAddVehicle(tenantId: string): Promise<{ allowed: boolean; reason?: string }> {
    const tenant = await this.tenantRepository.findOne({ where: { tenantId } });
    
    if (!tenant) {
      return { allowed: false, reason: 'Tenant no encontrado' };
    }

    if (tenant.vehiculosRegistrados >= tenant.limiteVehiculos) {
      return {
        allowed: false,
        reason: `Límite de ${tenant.limiteVehiculos} vehículos alcanzado para el plan ${tenant.plan}`,
      };
    }

    return { allowed: true };
  }

  async remove(id: string): Promise<void> {
    const result = await this.tenantRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Tenant con ID ${id} no encontrado`);
    }
  }
}
