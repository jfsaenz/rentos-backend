import { IsString, IsEmail, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTenantDto {
  @ApiProperty()
  @IsString()
  nombreAgencia: string;

  @ApiProperty()
  @IsEmail()
  emailAdmin: string;

  @ApiProperty({ enum: ['basico', 'profesional', 'empresarial'] })
  @IsEnum(['basico', 'profesional', 'empresarial'])
  plan: string;

  @ApiProperty()
  @IsString()
  fechaSuscripcion: string;

  @ApiProperty()
  @IsString()
  pais: string;

  @ApiProperty()
  @IsString()
  ciudad: string;
}
