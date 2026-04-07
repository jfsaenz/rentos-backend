import { IsString, IsNumber, IsEnum, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVehiculoDto {
  @ApiProperty()
  @IsString()
  modelo: string;

  @ApiProperty()
  @IsString()
  marca: string;

  @ApiProperty()
  @IsNumber()
  @Min(1900)
  anio: number;

  @ApiProperty()
  @IsString()
  placa: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  kilometraje: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  proximoMantenimiento: number;

  @ApiProperty({ enum: ['available', 'maintenance', 'rented'] })
  @IsEnum(['available', 'maintenance', 'rented'])
  estado: string;

  @ApiProperty({ enum: ['Sport', 'Adventure', 'Naked', 'Cruiser'] })
  @IsEnum(['Sport', 'Adventure', 'Naked', 'Cruiser'])
  tipo: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  precioDia: number;

  @ApiProperty()
  @IsString()
  foto: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  tenantId?: string;
}
