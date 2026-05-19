import { IsString, IsNumber, IsIn, IsBoolean, IsOptional, Allow } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTarifaDto {
  @ApiProperty()
  @IsString()
  nombre: string;

  @ApiProperty({ enum: ['descuento_largo', 'fin_semana', 'temporada_alta'] })
  @IsIn(['descuento_largo', 'fin_semana', 'temporada_alta'])
  tipo: string;

  @ApiProperty()
  @IsNumber()
  porcentaje: number;

  @ApiProperty()
  @Allow()
  vehiculosAplicables: any;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  activa?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  fechaInicio?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  fechaFin?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  tenantId?: string;
}