import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificacionesService } from './notificaciones.service';
import { CreateNotificacionDto } from './dto/create-notificacion.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('notificaciones')
@Controller('notificaciones')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificacionesController {
  constructor(private readonly notificacionesService: NotificacionesService) {}

  @Post()
  @ApiOperation({ summary: 'Enviar notificación' })
  enviar(@Body() createNotificacionDto: CreateNotificacionDto, @Request() req) {
    return this.notificacionesService.enviar({
      ...createNotificacionDto,
      tenantId: req.user.tenantId,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Obtener historial de notificaciones' })
  findAll(@Request() req) {
    return this.notificacionesService.findAll(req.user.tenantId);
  }
}
