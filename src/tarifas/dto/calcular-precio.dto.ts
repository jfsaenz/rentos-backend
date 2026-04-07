import { IsNumber, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CalcularPrecioDto {
  @ApiProperty()
  @IsNumber()
  precioBase: number;

  @ApiProperty()
  @IsString()
  fechaInicio: string;

  @ApiProperty()
  @IsString()
  fechaFin: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  vehiculoId?: number;
}
