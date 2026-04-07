import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('metricas')
  @ApiOperation({ summary: 'Obtener métricas del dashboard' })
  getMetricas(@Request() req) {
    return this.dashboardService.getMetricas(req.user.tenantId);
  }

  @Get('ingresos')
  @ApiOperation({ summary: 'Obtener análisis de ingresos' })
  getIngresos(@Request() req) {
    return this.dashboardService.getIngresos(req.user.tenantId);
  }

  @Get('top-vehiculos')
  @ApiOperation({ summary: 'Obtener top vehículos más rentados' })
  getTopVehiculos(@Request() req) {
    return this.dashboardService.getTopVehiculos(req.user.tenantId);
  }
}
