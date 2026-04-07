import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RagService } from './rag.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChatDto } from './dto/chat.dto';

@ApiTags('rag')
@Controller('rag')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RagController {
  constructor(private readonly ragService: RagService) {}

  @Post('chat')
  @ApiOperation({ summary: 'Enviar mensaje al asistente IA' })
  async chat(@Body() chatDto: ChatDto, @Request() req) {
    return this.ragService.chat(
      req.user.userId,
      chatDto.message,
      req.user.tenantId,
    );
  }

  @Get('conversations')
  @ApiOperation({ summary: 'Obtener historial de conversaciones' })
  async getConversations(@Request() req) {
    return this.ragService.getConversations(
      req.user.userId,
      req.user.tenantId,
    );
  }

  @Delete('conversations')
  @ApiOperation({ summary: 'Limpiar historial de conversaciones' })
  async clearConversations(@Request() req) {
    await this.ragService.clearConversations(req.user.userId);
    return { message: 'Historial limpiado exitosamente' };
  }
}
