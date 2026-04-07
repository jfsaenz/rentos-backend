import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { VehiculosModule } from '../vehiculos/vehiculos.module';
import { ReservasModule } from '../reservas/reservas.module';
import { ClientesModule } from '../clientes/clientes.module';

@Module({
  imports: [VehiculosModule, ReservasModule, ClientesModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
