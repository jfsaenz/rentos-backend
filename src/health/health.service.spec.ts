import { ServiceUnavailableException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import { HealthService } from './health.service';

describe('HealthService', () => {
  let service: HealthService;

  const mockDataSource = {
    query: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        {
          provide: getDataSourceToken(),
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<HealthService>(HealthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return service health metadata', () => {
    const result = service.getHealth();

    expect(result.status).toBe('ok');
    expect(result.service).toBe('RentOS Backend');
    expect(result.version).toBe('1.0.0');
    expect(result.timestamp).toBeDefined();
  });

  it('should return pong', () => {
    expect(service.ping()).toEqual({ message: 'pong' });
  });

  it('should return ready when database responds', async () => {
    mockDataSource.query.mockResolvedValue([{ '?column?': 1 }]);

    const result = await service.getReadiness();

    expect(mockDataSource.query).toHaveBeenCalledWith('SELECT 1');
    expect(result.status).toBe('ready');
    expect(result.checks.database).toBe('up');
  });

  it('should throw ServiceUnavailableException when database fails', async () => {
    mockDataSource.query.mockRejectedValue(new Error('connection failed'));

    await expect(service.getReadiness()).rejects.toThrow(ServiceUnavailableException);
  });
});
