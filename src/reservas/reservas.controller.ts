import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReservasService } from './reservas.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { VerificarDisponibilidadDto } from './dto/verificar-disponibilidad.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('reservas')
@Controller('reservas')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva reserva' })
  create(@Body() createReservaDto: CreateReservaDto, @Request() req) {
    return this.reservasService.create({
      ...createReservaDto,
      tenantId: req.user.tenantId,
    });
  }

  @Post('verificar-disponibilidad')
  @ApiOperation({ summary: 'Verificar disponibilidad de vehículo' })
  verificarDisponibilidad(@Body() dto: VerificarDisponibilidadDto, @Request() req) {
    return this.reservasService.verificarDisponibilidad(
      dto.vehiculoId,
      dto.fechaInicio,
      dto.fechaFin,
      dto.excluirReservaId,
      req.user.tenantId,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las reservas' })
  findAll(@Request() req) {
    return this.reservasService.findAll(req.user.tenantId);
  }

  @Get('activas')
  @ApiOperation({ summary: 'Obtener reservas activas' })
  findActivas(@Request() req) {
    return this.reservasService.findActivas(req.user.tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener reserva por ID' })
  findOne(@Param('id') id: string) {
    return this.reservasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar reserva' })
  update(@Param('id') id: string, @Body() updateReservaDto: UpdateReservaDto) {
    return this.reservasService.update(id, updateReservaDto);
  }

  @Patch(':id/cancelar')
  @ApiOperation({ summary: 'Cancelar reserva' })
  cancelar(@Param('id') id: string) {
    return this.reservasService.cancelar(id);
  }

  @Patch(':id/finalizar')
  @ApiOperation({ summary: 'Finalizar reserva' })
  finalizar(@Param('id') id: string) {
    return this.reservasService.finalizar(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar reserva' })
  remove(@Param('id') id: string) {
    return this.reservasService.remove(id);
  }
}
