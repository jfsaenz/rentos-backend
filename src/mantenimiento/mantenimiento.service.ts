import { Injectable } from '@nestjs/common';
import { VehiculosService } from '../vehiculos/vehiculos.service';

@Injectable()
export class MantenimientoService {
  constructor(private vehiculosService: VehiculosService) {}

  async getVehiculosPendientes(tenantId?: string) {
    const vehiculos = await this.vehiculosService.findAll(tenantId);
    
    const pendientes = vehiculos.filter(v => {
      const kmRestantes = v.proximoMantenimiento - v.kilometraje;
      return kmRestantes <= 500 || v.estado === 'maintenance';
    });

    return pendientes.map(v => ({
      ...v,
      kmRestantes: v.proximoMantenimiento - v.kilometraje,
      urgencia: v.proximoMantenimiento - v.kilometraje <= 200 ? 'alta' : 'media',
    }));
  }
}
