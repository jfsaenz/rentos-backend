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
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { VehiculosService } from './vehiculos.service';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('vehiculos')
@Controller('vehiculos')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VehiculosController {
  constructor(private readonly vehiculosService: VehiculosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo vehículo' })
  create(@Body() createVehiculoDto: CreateVehiculoDto, @Request() req) {
    return this.vehiculosService.create({
      ...createVehiculoDto,
      tenantId: req.user.tenantId,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los vehículos' })
  findAll(@Request() req) {
    return this.vehiculosService.findAll(req.user.tenantId);
  }

  @Get('estado/:estado')
  @ApiOperation({ summary: 'Obtener vehículos por estado' })
  findByEstado(@Param('estado') estado: string, @Request() req) {
    return this.vehiculosService.findByEstado(estado, req.user.tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener vehículo por ID' })
  findOne(@Param('id') id: string) {
    return this.vehiculosService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar vehículo' })
  update(@Param('id') id: string, @Body() updateVehiculoDto: UpdateVehiculoDto) {
    return this.vehiculosService.update(+id, updateVehiculoDto);
  }

  @Patch(':id/estado')
  @ApiOperation({ summary: 'Actualizar estado del vehículo' })
  updateEstado(@Param('id') id: string, @Body('estado') estado: string) {
    return this.vehiculosService.updateEstado(+id, estado);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar vehículo' })
  remove(@Param('id') id: string) {
    return this.vehiculosService.remove(+id);
  }
}
