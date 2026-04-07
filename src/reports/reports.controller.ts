import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('reports')
@Controller('reports')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('ingresos')
  @ApiOperation({ summary: 'Get income report' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'vehiculoId', required: false })
  async getIngresosReport(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('vehiculoId') vehiculoId?: number,
  ) {
    return await this.reportsService.getIngresosReport({
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      vehiculoId,
    });
  }

  @Get('vehiculos')
  @ApiOperation({ summary: 'Get vehicles report with statistics' })
  async getVehiculosReport() {
    return await this.reportsService.getVehiculosReport();
  }

  @Get('clientes')
  @ApiOperation({ summary: 'Get clients report with statistics' })
  async getClientesReport() {
    return await this.reportsService.getClientesReport();
  }

  @Get('ocupacion')
  @ApiOperation({ summary: 'Get occupation rate report' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  async getOcupacionReport(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return await this.reportsService.getOcupacionReport({
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  }
}
