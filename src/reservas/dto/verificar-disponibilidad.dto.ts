import { IsNumber, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerificarDisponibilidadDto {
  @ApiProperty()
  @IsNumber()
  vehiculoId: number;

  @ApiProperty()
  @IsString()
  fechaInicio: string;

  @ApiProperty()
  @IsString()
  fechaFin: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  excluirReservaId?: string;
}
