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
import { TarifasService } from './tarifas.service';
import { CreateTarifaDto } from './dto/create-tarifa.dto';
import { UpdateTarifaDto } from './dto/update-tarifa.dto';
import { CalcularPrecioDto } from './dto/calcular-precio.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('tarifas')
@Controller('tarifas')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TarifasController {
  constructor(private readonly tarifasService: TarifasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva tarifa' })
  create(@Body() createTarifaDto: CreateTarifaDto, @Request() req) {
    return this.tarifasService.create({
      ...createTarifaDto,
      tenantId: req.user.tenantId,
    });
  }

  @Post('calcular-precio')
  @ApiOperation({ summary: 'Calcular precio con tarifas dinámicas' })
  calcularPrecio(@Body() dto: CalcularPrecioDto, @Request() req) {
    return this.tarifasService.calcularPrecioFinal(
      dto.precioBase,
      dto.fechaInicio,
      dto.fechaFin,
      dto.vehiculoId,
      req.user.tenantId,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las tarifas' })
  findAll(@Request() req) {
    return this.tarifasService.findAll(req.user.tenantId);
  }

  @Get('activas')
  @ApiOperation({ summary: 'Obtener tarifas activas' })
  findActivas(@Request() req) {
    return this.tarifasService.findActivas(req.user.tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener tarifa por ID' })
  findOne(@Param('id') id: string) {
    return this.tarifasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar tarifa' })
  update(@Param('id') id: string, @Body() updateTarifaDto: UpdateTarifaDto) {
    return this.tarifasService.update(id, updateTarifaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar tarifa' })
  remove(@Param('id') id: string) {
    return this.tarifasService.remove(id);
  }
}
