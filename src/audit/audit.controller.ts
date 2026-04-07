import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('audit')
@Controller('audit')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @ApiOperation({ summary: 'Get audit logs' })
  async findAll(
    @Query('userId') userId?: string,
    @Query('entity') entity?: string,
    @Query('action') action?: string,
  ) {
    return await this.auditService.findAll({ userId, entity, action });
  }

  @Get('entity')
  @ApiOperation({ summary: 'Get audit logs for specific entity' })
  async findByEntity(
    @Query('entity') entity: string,
    @Query('entityId') entityId: string,
  ) {
    return await this.auditService.findByEntity(entity, entityId);
  }
}
