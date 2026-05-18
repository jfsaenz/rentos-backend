import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class HealthService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'RentOS Backend',
      version: '1.0.0',
      uptime: process.uptime(),
    };
  }

  ping() {
    return { message: 'pong' };
  }

  async getReadiness() {
    try {
      await this.dataSource.query('SELECT 1');

      return {
        status: 'ready',
        checks: {
          database: 'up',
        },
        timestamp: new Date().toISOString(),
      };
    } catch {
      throw new ServiceUnavailableException({
        status: 'not_ready',
        checks: {
          database: 'down',
        },
        timestamp: new Date().toISOString(),
      });
    }
  }
}
