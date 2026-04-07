import { IsString, IsEmail, IsEnum, IsObject, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClienteDto {
  @ApiProperty()
  @IsString()
  nombre: string;

  @ApiProperty({ enum: ['CC', 'Pasaporte', 'CE'] })
  @IsEnum(['CC', 'Pasaporte', 'CE'])
  tipoDocumento: string;

  @ApiProperty()
  @IsString()
  numeroDocumento: string;

  @ApiProperty()
  @IsString()
  telefono: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  fechaNacimiento: string;

  @ApiProperty()
  @IsObject()
  licencia: {
    numero: string;
    categoria: string;
    fechaVencimiento: string;
  };

  @ApiProperty()
  @IsString()
  direccion: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  tenantId?: string;
}
