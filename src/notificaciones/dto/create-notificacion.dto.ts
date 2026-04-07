import { IsString, IsEmail, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificacionDto {
  @ApiProperty({ enum: ['confirmacion', 'cancelacion', 'recibo', 'recordatorio'] })
  @IsEnum(['confirmacion', 'cancelacion', 'recibo', 'recordatorio'])
  tipo: string;

  @ApiProperty()
  @IsString()
  destinatario: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  asunto: string;

  @ApiProperty()
  @IsString()
  mensaje: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  reservaId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  tenantId?: string;
}
