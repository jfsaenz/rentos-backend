import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

@Injectable()
export class BackupService {
  private readonly logger = new Logger(BackupService.name);
  private readonly backupDir = path.join(process.cwd(), 'backups');

  constructor() {
    // Crear directorio de backups si no existe
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  // Backup automático cada día a las 2 AM
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async handleDailyBackup() {
    this.logger.log('Starting daily backup...');
    try {
      await this.createBackup();
      this.logger.log('Daily backup completed successfully');
    } catch (error) {
      this.logger.error('Daily backup failed', error);
    }
  }

  async createBackup(): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup-${timestamp}.sql`;
    const filepath = path.join(this.backupDir, filename);

    const dbHost = process.env.DATABASE_HOST || 'localhost';
    const dbPort = process.env.DATABASE_PORT || '5432';
    const dbUser = process.env.DATABASE_USER || 'postgres';
    const dbName = process.env.DATABASE_NAME || 'rentos_db';
    const dbPassword = process.env.DATABASE_PASSWORD || '';

    // Comando pg_dump
    const command = `PGPASSWORD="${dbPassword}" pg_dump -h ${dbHost} -p ${dbPort} -U ${dbUser} -d ${dbName} -F c -f ${filepath}`;

    try {
      await execAsync(command);
      this.logger.log(`Backup created: ${filename}`);
      
      // Limpiar backups antiguos (mantener últimos 7 días)
      await this.cleanOldBackups(7);
      
      return filepath;
    } catch (error) {
      this.logger.error('Backup creation failed', error);
      throw error;
    }
  }

  async listBackups(): Promise<string[]> {
    try {
      const files = fs.readdirSync(this.backupDir);
      return files
        .filter((file) => file.endsWith('.sql'))
        .sort()
        .reverse();
    } catch (error) {
      this.logger.error('Failed to list backups', error);
      return [];
    }
  }

  async restoreBackup(filename: string): Promise<void> {
    const filepath = path.join(this.backupDir, filename);

    if (!fs.existsSync(filepath)) {
      throw new Error(`Backup file not found: ${filename}`);
    }

    const dbHost = process.env.DATABASE_HOST || 'localhost';
    const dbPort = process.env.DATABASE_PORT || '5432';
    const dbUser = process.env.DATABASE_USER || 'postgres';
    const dbName = process.env.DATABASE_NAME || 'rentos_db';
    const dbPassword = process.env.DATABASE_PASSWORD || '';

    const command = `PGPASSWORD="${dbPassword}" pg_restore -h ${dbHost} -p ${dbPort} -U ${dbUser} -d ${dbName} -c ${filepath}`;

    try {
      await execAsync(command);
      this.logger.log(`Backup restored: ${filename}`);
    } catch (error) {
      this.logger.error('Backup restoration failed', error);
      throw error;
    }
  }

  private async cleanOldBackups(daysToKeep: number): Promise<void> {
    try {
      const files = fs.readdirSync(this.backupDir);
      const now = Date.now();
      const maxAge = daysToKeep * 24 * 60 * 60 * 1000;

      for (const file of files) {
        if (!file.endsWith('.sql')) continue;

        const filepath = path.join(this.backupDir, file);
        const stats = fs.statSync(filepath);
        const age = now - stats.mtimeMs;

        if (age > maxAge) {
          fs.unlinkSync(filepath);
          this.logger.log(`Deleted old backup: ${file}`);
        }
      }
    } catch (error) {
      this.logger.error('Failed to clean old backups', error);
    }
  }
}
