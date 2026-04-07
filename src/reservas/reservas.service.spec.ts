import { Test, TestingModule } from '@nestjs/testing';
import { ReservasService } from './reservas.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Reserva } from './entities/reserva.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ReservasService', () => {
  let service: ReservasService;

  const mockReservaRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservasService,
        {
          provide: getRepositoryToken(Reserva),
          useValue: mockReservaRepository,
        },
      ],
    }).compile();

    service = module.get<ReservasService>(ReservasService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all reservas', async () => {
      const mockReservas = [
        {
          id: 'res-1',
          vehiculoId: 1,
          clienteId: 'cli-1',
          estado: 'confirmada',
        },
      ];

      mockReservaRepository.find.mockResolvedValue(mockReservas);

      const result = await service.findAll();

      expect(result).toEqual(mockReservas);
    });
  });

  describe('create', () => {
    it('should create a new reserva', async () => {
      const createDto = {
        vehiculoId: 1,
        clienteId: 'cli-1',
        fechaInicio: '2026-05-01',
        fechaFin: '2026-05-05',
        totalFinal: 200,
        estado: 'confirmada' as const,
        desglose: {
          subtotal: 180,
          descuentos: 0,
          recargos: 20,
          deposito: 40,
        },
      };

      const savedReserva = { id: 'res-1', ...createDto };

      mockReservaRepository.find.mockResolvedValue([]);
      mockReservaRepository.create.mockReturnValue(createDto);
      mockReservaRepository.save.mockResolvedValue(savedReserva);

      const result = await service.create(createDto);

      expect(result).toEqual(savedReserva);
      expect(mockReservaRepository.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException if vehicle not available', async () => {
      const createDto = {
        vehiculoId: 1,
        clienteId: 'cli-1',
        fechaInicio: '2026-05-01',
        fechaFin: '2026-05-05',
        totalFinal: 200,
        estado: 'confirmada' as const,
        desglose: {
          subtotal: 180,
          descuentos: 0,
          recargos: 20,
          deposito: 40,
        },
      };

      // Simulate existing reservation
      mockReservaRepository.find.mockResolvedValue([
        {
          id: 'res-existing',
          vehiculoId: 1,
          fechaInicio: '2026-05-03',
          fechaFin: '2026-05-07',
          estado: 'confirmada',
        },
      ]);

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('verificarDisponibilidad', () => {
    it('should return disponible true if no conflicts', async () => {
      mockReservaRepository.find.mockResolvedValue([]);

      const result = await service.verificarDisponibilidad({
        vehiculoId: 1,
        fechaInicio: '2026-05-01',
        fechaFin: '2026-05-05',
      });

      expect(result.disponible).toBe(true);
    });

    it('should return disponible false if conflicts exist', async () => {
      mockReservaRepository.find.mockResolvedValue([
        {
          id: 'res-1',
          vehiculoId: 1,
          fechaInicio: '2026-05-03',
          fechaFin: '2026-05-07',
          estado: 'confirmada',
        },
      ]);

      const result = await service.verificarDisponibilidad({
        vehiculoId: 1,
        fechaInicio: '2026-05-01',
        fechaFin: '2026-05-05',
      });

      expect(result.disponible).toBe(false);
    });
  });

  describe('cancelar', () => {
    it('should cancel a reserva', async () => {
      const reserva = {
        id: 'res-1',
        estado: 'confirmada',
      };

      mockReservaRepository.findOne.mockResolvedValue(reserva);
      mockReservaRepository.save.mockResolvedValue({
        ...reserva,
        estado: 'cancelada',
      });

      const result = await service.cancelar('res-1');

      expect(result.estado).toBe('cancelada');
    });
  });

  describe('finalizar', () => {
    it('should finalize a reserva', async () => {
      const reserva = {
        id: 'res-1',
        estado: 'confirmada',
      };

      mockReservaRepository.findOne.mockResolvedValue(reserva);
      mockReservaRepository.save.mockResolvedValue({
        ...reserva,
        estado: 'finalizada',
      });

      const result = await service.finalizar('res-1');

      expect(result.estado).toBe('finalizada');
    });
  });
});
