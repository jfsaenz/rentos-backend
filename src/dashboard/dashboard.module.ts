import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { VehiculosModule } from '../vehiculos/vehiculos.module';
import { ReservasModule } from '../reservas/reservas.module';
import { ClientesModule } from '../clientes/clientes.module';
import { Vehiculo } from '../vehiculos/entities/vehiculo.entity';
import { Reserva } from '../reservas/entities/reserva.entity';
import { Cliente } from '../clientes/entities/cliente.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vehiculo, Reserva, Cliente]),
    VehiculosModule,
    ReservasModule,
    ClientesModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
