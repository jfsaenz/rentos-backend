import { IsNumber, IsString, IsObject, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservaDto {
  @ApiProperty()
  @IsNumber()
  vehiculoId: number;

  @ApiProperty()
  @IsString()
  clienteId: string;

  @ApiProperty()
  @IsString()
  fechaInicio: string;

  @ApiProperty()
  @IsString()
  fechaFin: string;

  @ApiProperty()
  @IsObject()
  desglose: {
    dias: number;
    precioDia: number;
    totalExtras: number;
  };

  @ApiProperty()
  @IsNumber()
  totalFinal: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  pago?: {
    metodoPago: string;
    estado: string;
    fechaOperacion: string;
    referencia: string;
  };

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  tenantId?: string;
}
