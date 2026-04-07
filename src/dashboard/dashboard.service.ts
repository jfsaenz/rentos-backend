import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehiculo } from '../vehiculos/entities/vehiculo.entity';
import { Reserva } from '../reservas/entities/reserva.entity';
import { Cliente } from '../clientes/entities/cliente.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Vehiculo)
    private vehiculoRepository: Repository<Vehiculo>,
    @InjectRepository(Reserva)
    private reservaRepository: Repository<Reserva>,
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
  ) {}

  async getMetricas(tenantId?: string) {
    const where = tenantId ? { tenantId } : {};
    const hoy = new Date();
    const inicioMesActual = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const inicioMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
    const finMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth(), 0);

    // Vehículos
    const vehiculos = await this.vehiculoRepository.find({ where });
    const flotaTotal = vehiculos.length;
    const disponibles = vehiculos.filter(v => v.estado === 'available').length;
    const enTaller = vehiculos.filter(v => v.estado === 'maintenance').length;
    const alquilados = vehiculos.filter(v => v.estado === 'rented').length;

    // Reservas
    const reservasQuery = this.reservaRepository.createQueryBuilder('reserva');
    if (tenantId) reservasQuery.where('reserva.tenantId = :tenantId', { tenantId });

    const reservas = await reservasQuery.getMany();

    // Ingresos mes actual
    const ingresosMesActual = reservas
      .filter(r => {
        const fecha = new Date(r.fechaInicio);
        return fecha >= inicioMesActual && r.estado !== 'cancelada';
      })
      .reduce((sum, r) => sum + Number(r.totalFinal), 0);

    // Ingresos mes anterior
    const ingresosMesAnterior = reservas
      .filter(r => {
        const fecha = new Date(r.fechaInicio);
        return fecha >= inicioMesAnterior && fecha <= finMesAnterior && r.estado !== 'cancelada';
      })
      .reduce((sum, r) => sum + Number(r.totalFinal), 0);

    const cambioIngresos = ingresosMesAnterior > 0
      ? ((ingresosMesActual - ingresosMesAnterior) / ingresosMesAnterior) * 100
      : 0;

    // Reservas activas hoy
    const hoyStr = hoy.toISOString().split('T')[0];
    const reservasActivasHoy = reservas.filter(r => {
      return r.fechaInicio <= hoyStr && r.fechaFin >= hoyStr && r.estado === 'confirmada';
    }).length;

    // Clientes
    const clientesTotales = await this.clienteRepository.count({ where });

    // Tasa de ocupación
    const tasaOcupacion = flotaTotal > 0 ? (alquilados / flotaTotal) * 100 : 0;

    return {
      ingresosMesActual,
      cambioIngresos,
      flotaTotal,
      disponibles,
      enTaller,
      alquilados,
      reservasActivasHoy,
      clientesTotales,
      tasaOcupacion,
    };
  }

  async getIngresos(tenantId?: string) {
    const where = tenantId ? { tenantId } : {};
    const hoy = new Date();
    const ingresosPorSemana = [];

    const reservasQuery = this.reservaRepository.createQueryBuilder('reserva');
    if (tenantId) reservasQuery.where('reserva.tenantId = :tenantId', { tenantId });
    const reservas = await reservasQuery.getMany();

    for (let i = 7; i >= 0; i--) {
      const inicioSemana = new Date(hoy);
      inicioSemana.setDate(hoy.getDate() - (i * 7));
      const finSemana = new Date(inicioSemana);
      finSemana.setDate(inicioSemana.getDate() + 6);

      const ingresos = reservas
        .filter(r => {
          const fecha = new Date(r.fechaInicio);
          return fecha >= inicioSemana && fecha <= finSemana && r.estado !== 'cancelada';
        })
        .reduce((sum, r) => sum + Number(r.totalFinal), 0);

      ingresosPorSemana.push({
        semana: `S${8 - i}`,
        ingresos,
      });
    }

    return { ingresosPorSemana };
  }

  async getTopVehiculos(tenantId?: string) {
    const reservasQuery = this.reservaRepository
      .createQueryBuilder('reserva')
      .leftJoinAndSelect('reserva.vehiculo', 'vehiculo')
      .where('reserva.estado != :estado', { estado: 'cancelada' });

    if (tenantId) {
      reservasQuery.andWhere('reserva.tenantId = :tenantId', { tenantId });
    }

    const reservas = await reservasQuery.getMany();

    const conteo: Record<number, { vehiculo: any; count: number }> = {};

    reservas.forEach(r => {
      if (!conteo[r.vehiculoId]) {
        conteo[r.vehiculoId] = { vehiculo: r.vehiculo, count: 0 };
      }
      conteo[r.vehiculoId].count++;
    });

    const topVehiculos = Object.values(conteo)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map(item => ({
        vehiculo: item.vehiculo,
        alquileres: item.count,
      }));

    return { topVehiculos };
  }
}
