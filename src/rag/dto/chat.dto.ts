import { IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChatDto {
  @ApiProperty()
  @IsString()
  @MaxLength(5000)
  message: string;
}
