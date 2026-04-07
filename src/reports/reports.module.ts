import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { Reserva } from '../reservas/entities/reserva.entity';
import { Vehiculo } from '../vehiculos/entities/vehiculo.entity';
import { Cliente } from '../clientes/entities/cliente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reserva, Vehiculo, Cliente])],
  providers: [ReportsService],
  controllers: [ReportsController],
  exports: [ReportsService],
})
export class ReportsModule {}
