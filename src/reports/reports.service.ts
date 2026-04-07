import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Reserva } from '../reservas/entities/reserva.entity';
import { Vehiculo } from '../vehiculos/entities/vehiculo.entity';
import { Cliente } from '../clientes/entities/cliente.entity';

export interface ReportFilters {
  startDate?: Date;
  endDate?: Date;
  vehiculoId?: number;
  clienteId?: string;
  estado?: string;
}

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Reserva)
    private reservaRepository: Repository<Reserva>,
    @InjectRepository(Vehiculo)
    private vehiculoRepository: Repository<Vehiculo>,
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
  ) {}

  async getIngresosReport(filters: ReportFilters) {
    const query = this.reservaRepository.createQueryBuilder('reserva');

    if (filters.startDate && filters.endDate) {
      query.where('reserva.fechaInicio BETWEEN :start AND :end', {
        start: filters.startDate,
        end: filters.endDate,
      });
    }

    if (filters.vehiculoId) {
      query.andWhere('reserva.vehiculoId = :vehiculoId', {
        vehiculoId: filters.vehiculoId,
      });
    }

    if (filters.estado) {
      query.andWhere('reserva.estado = :estado', { estado: filters.estado });
    }

    const reservas = await query.getMany();

    const totalIngresos = reservas.reduce(
      (sum, r) => sum + (r.totalFinal || 0),
      0,
    );
    const totalReservas = reservas.length;
    const promedioIngreso = totalReservas > 0 ? totalIngresos / totalReservas : 0;

    // Agrupar por mes
    const ingresosPorMes = reservas.reduce((acc, reserva) => {
      const mes = new Date(reserva.fechaInicio).toISOString().slice(0, 7);
      if (!acc[mes]) {
        acc[mes] = { mes, ingresos: 0, reservas: 0 };
      }
      acc[mes].ingresos += reserva.totalFinal || 0;
      acc[mes].reservas += 1;
      return acc;
    }, {} as Record<string, any>);

    return {
      totalIngresos,
      totalReservas,
      promedioIngreso,
      ingresosPorMes: Object.values(ingresosPorMes),
      reservas,
    };
  }

  async getVehiculosReport() {
    const vehiculos = await this.vehiculoRepository.find();
    const reservas = await this.reservaRepository.find();

    const vehiculosConEstadisticas = vehiculos.map((vehiculo) => {
      const reservasVehiculo = reservas.filter(
        (r) => r.vehiculoId === vehiculo.id,
      );
      const totalReservas = reservasVehiculo.length;
      const totalIngresos = reservasVehiculo.reduce(
        (sum, r) => sum + (r.totalFinal || 0),
        0,
      );
      const reservasActivas = reservasVehiculo.filter(
        (r) => r.estado === 'confirmada',
      ).length;

      return {
        ...vehiculo,
        estadisticas: {
          totalReservas,
          totalIngresos,
          reservasActivas,
          promedioIngreso: totalReservas > 0 ? totalIngresos / totalReservas : 0,
        },
      };
    });

    return {
      totalVehiculos: vehiculos.length,
      disponibles: vehiculos.filter((v) => v.estado === 'available').length,
      rentados: vehiculos.filter((v) => v.estado === 'rented').length,
      enMantenimiento: vehiculos.filter((v) => v.estado === 'maintenance')
        .length,
      vehiculos: vehiculosConEstadisticas,
    };
  }

  async getClientesReport() {
    const clientes = await this.clienteRepository.find();
    const reservas = await this.reservaRepository.find();

    const clientesConEstadisticas = clientes.map((cliente) => {
      const reservasCliente = reservas.filter(
        (r) => r.clienteId === cliente.id,
      );
      const totalReservas = reservasCliente.length;
      const totalGastado = reservasCliente.reduce(
        (sum, r) => sum + (r.totalFinal || 0),
        0,
      );
      const cancelaciones = reservasCliente.filter(
        (r) => r.estado === 'cancelada',
      ).length;

      return {
        ...cliente,
        estadisticas: {
          totalReservas,
          totalGastado,
          cancelaciones,
          promedioGasto: totalReservas > 0 ? totalGastado / totalReservas : 0,
        },
      };
    });

    // Top 10 clientes por gasto
    const topClientes = clientesConEstadisticas
      .sort((a, b) => b.estadisticas.totalGastado - a.estadisticas.totalGastado)
      .slice(0, 10);

    return {
      totalClientes: clientes.length,
      clientes: clientesConEstadisticas,
      topClientes,
    };
  }

  async getOcupacionReport(filters: ReportFilters) {
    const vehiculos = await this.vehiculoRepository.find();
    const query = this.reservaRepository.createQueryBuilder('reserva');

    if (filters.startDate && filters.endDate) {
      query.where('reserva.fechaInicio BETWEEN :start AND :end', {
        start: filters.startDate,
        end: filters.endDate,
      });
    }

    const reservas = await query.getMany();

    const diasTotales = filters.startDate && filters.endDate
      ? Math.ceil(
          (filters.endDate.getTime() - filters.startDate.getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : 30;

    const diasDisponibles = vehiculos.length * diasTotales;
    const diasOcupados = reservas.reduce((sum, r) => {
      const dias = Math.ceil(
        (new Date(r.fechaFin).getTime() -
          new Date(r.fechaInicio).getTime()) /
          (1000 * 60 * 60 * 24),
      );
      return sum + dias;
    }, 0);

    const tasaOcupacion = (diasOcupados / diasDisponibles) * 100;

    return {
      diasDisponibles,
      diasOcupados,
      tasaOcupacion: Math.round(tasaOcupacion * 100) / 100,
      vehiculosTotales: vehiculos.length,
      reservasTotales: reservas.length,
    };
  }
}
