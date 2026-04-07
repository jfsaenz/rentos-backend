import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BackupService } from './backup.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('backup')
@Controller('backup')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create manual backup' })
  async createBackup() {
    const filepath = await this.backupService.createBackup();
    return {
      message: 'Backup created successfully',
      filepath,
    };
  }

  @Get('list')
  @ApiOperation({ summary: 'List all backups' })
  async listBackups() {
    const backups = await this.backupService.listBackups();
    return { backups };
  }

  @Post('restore/:filename')
  @ApiOperation({ summary: 'Restore backup from file' })
  async restoreBackup(@Param('filename') filename: string) {
    await this.backupService.restoreBackup(filename);
    return {
      message: 'Backup restored successfully',
      filename,
    };
  }
}
