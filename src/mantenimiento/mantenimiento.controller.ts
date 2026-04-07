import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MantenimientoService } from './mantenimiento.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('mantenimiento')
@Controller('mantenimiento')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MantenimientoController {
  constructor(private readonly mantenimientoService: MantenimientoService) {}

  @Get('pendientes')
  @ApiOperation({ summary: 'Obtener vehículos con mantenimiento pendiente' })
  getPendientes(@Request() req) {
    return this.mantenimientoService.getVehiculosPendientes(req.user.tenantId);
  }
}
