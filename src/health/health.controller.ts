import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  check() {
    return this.healthService.getHealth();
  }

  @Get('ping')
  @ApiOperation({ summary: 'Simple ping endpoint' })
  @ApiResponse({ status: 200, description: 'Pong response' })
  ping() {
    return this.healthService.ping();
  }

  @Get('ready')
  @ApiOperation({ summary: 'Readiness check with database validation' })
  @ApiResponse({ status: 200, description: 'Service and database are ready' })
  @ApiResponse({ status: 503, description: 'Database is not reachable' })
  ready() {
    return this.healthService.getReadiness();
  }
}
