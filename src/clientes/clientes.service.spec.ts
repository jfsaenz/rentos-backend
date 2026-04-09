import { Test, TestingModule } from '@nestjs/testing';
import { ClientesService } from './clientes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { NotFoundException } from '@nestjs/common';

describe('ClientesService', () => {
  let service: ClientesService;

  const mockClienteRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientesService,
        {
          provide: getRepositoryToken(Cliente),
          useValue: mockClienteRepository,
        },
      ],
    }).compile();

    service = module.get<ClientesService>(ClientesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all clientes', async () => {
      const mockClientes = [
        {
          id: 'cli-1',
          nombre: 'Juan Pérez',
          email: 'juan@example.com',
          score: 100,
        },
        {
          id: 'cli-2',
          nombre: 'María García',
          email: 'maria@example.com',
          score: 95,
        },
      ];

      mockClienteRepository.find.mockResolvedValue(mockClientes);

      const result = await service.findAll();

      expect(result).toEqual(mockClientes);
      expect(mockClienteRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a cliente by id', async () => {
      const mockCliente = {
        id: 'cli-1',
        nombre: 'Juan Pérez',
        email: 'juan@example.com',
      };

      mockClienteRepository.findOne.mockResolvedValue(mockCliente);

      const result = await service.findOne('cli-1');

      expect(result).toEqual(mockCliente);
    });

    it('should throw NotFoundException if cliente not found', async () => {
      mockClienteRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('cli-999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new cliente with initial score of 100', async () => {
      const createDto = {
        nombre: 'Juan Pérez',
        email: 'juan@example.com',
        telefono: '3001234567',
        numeroDocumento: '1234567890',
        tipoDocumento: 'CC' as const,
        fechaNacimiento: '1990-01-01',
        licencia: {
          numero: 'LIC123',
          categoria: 'B1',
          fechaVencimiento: '2030-01-01',
        },
        direccion: 'Calle 123',
        ciudad: 'Bogotá',
      };

      const savedCliente = {
        id: 'cli-1',
        ...createDto,
        score: 100,
        reservasTotales: 0,
        totalGastado: 0,
        cancelaciones: 0,
      };

      mockClienteRepository.create.mockReturnValue(savedCliente);
      mockClienteRepository.save.mockResolvedValue(savedCliente);

      const result = await service.create(createDto);

      expect(result.score).toBe(100);
      expect(result.reservasTotales).toBe(0);
      expect(mockClienteRepository.save).toHaveBeenCalled();
    });
  });

  describe('search', () => {
    it('should search clientes by query', async () => {
      const mockClientes = [
        { id: 'cli-1', nombre: 'Juan Pérez', email: 'juan@example.com' },
      ];

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        setParameter: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockClientes),
      };

      mockClienteRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.search('Juan');

      expect(result).toEqual(mockClientes);
      expect(mockQueryBuilder.where).toHaveBeenCalled();
    });
  });
});
