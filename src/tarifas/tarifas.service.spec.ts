import { Test, TestingModule } from '@nestjs/testing';
import { TarifasService } from './tarifas.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tarifa } from './entities/tarifa.entity';
import { NotFoundException } from '@nestjs/common';

describe('TarifasService', () => {
  let service: TarifasService;

  const mockTarifaRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TarifasService,
        {
          provide: getRepositoryToken(Tarifa),
          useValue: mockTarifaRepository,
        },
      ],
    }).compile();

    service = module.get<TarifasService>(TarifasService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new tarifa', async () => {
      const createDto = {
        nombre: 'Descuento Largo Plazo',
        tipo: 'descuento_largo' as const,
        porcentaje: -15,
        activa: true,
        vehiculosAplicables: 'todos' as const,
      };

      const savedTarifa = { id: 'tar-1', ...createDto };

      mockTarifaRepository.create.mockReturnValue(createDto);
      mockTarifaRepository.save.mockResolvedValue(savedTarifa);

      const result = await service.create(createDto);

      expect(result).toEqual(savedTarifa);
    });
  });

  describe('queries', () => {
    it('should list tarifas by tenant', async () => {
      const tarifas = [{ id: 'tar-1', tenantId: 'tenant-1' }];
      mockTarifaRepository.find.mockResolvedValue(tarifas);

      await expect(service.findAll('tenant-1')).resolves.toEqual(tarifas);
      expect(mockTarifaRepository.find).toHaveBeenCalledWith({
        where: { tenantId: 'tenant-1' },
      });
    });

    it('should list active tarifas by tenant', async () => {
      const tarifas = [{ id: 'tar-1', activa: true, tenantId: 'tenant-1' }];
      mockTarifaRepository.find.mockResolvedValue(tarifas);

      await expect(service.findActivas('tenant-1')).resolves.toEqual(tarifas);
      expect(mockTarifaRepository.find).toHaveBeenCalledWith({
        where: { activa: true, tenantId: 'tenant-1' },
      });
    });

    it('should return one tarifa', async () => {
      const tarifa = { id: 'tar-1', nombre: 'Fin de semana' };
      mockTarifaRepository.findOne.mockResolvedValue(tarifa);

      await expect(service.findOne('tar-1')).resolves.toEqual(tarifa);
    });

    it('should throw when tarifa does not exist', async () => {
      mockTarifaRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update and remove', () => {
    it('should update a tarifa', async () => {
      const updated = { id: 'tar-1', activa: false };
      mockTarifaRepository.update.mockResolvedValue({ affected: 1 });
      mockTarifaRepository.findOne.mockResolvedValue(updated);

      await expect(service.update('tar-1', { activa: false })).resolves.toEqual(updated);
      expect(mockTarifaRepository.update).toHaveBeenCalledWith('tar-1', { activa: false });
    });

    it('should remove a tarifa', async () => {
      mockTarifaRepository.delete.mockResolvedValue({ affected: 1 });

      await expect(service.remove('tar-1')).resolves.toBeUndefined();
    });

    it('should throw when removing a missing tarifa', async () => {
      mockTarifaRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove('missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('calcularPrecioFinal', () => {
    it('should apply long rental discount and multiply by days', async () => {
      mockTarifaRepository.find.mockResolvedValue([
        {
          nombre: 'Descuento semanal',
          tipo: 'descuento_largo',
          porcentaje: -15,
          activa: true,
          vehiculosAplicables: 'todos',
        },
      ]);

      const result = await service.calcularPrecioFinal(100, '2026-05-01', '2026-05-08');

      expect(result.precioFinal).toBe(595);
      expect(result.tarifasAplicadas).toHaveLength(1);
    });

    it('should apply weekend surcharge', async () => {
      mockTarifaRepository.find.mockResolvedValue([
        {
          nombre: 'Fin de semana',
          tipo: 'fin_semana',
          porcentaje: 20,
          activa: true,
          vehiculosAplicables: 'todos',
        },
      ]);

      const result = await service.calcularPrecioFinal(100, '2026-05-02', '2026-05-04');

      expect(result.precioFinal).toBe(240);
    });

    it('should apply high season surcharge when dates overlap', async () => {
      mockTarifaRepository.find.mockResolvedValue([
        {
          nombre: 'Temporada alta',
          tipo: 'temporada_alta',
          porcentaje: 30,
          activa: true,
          vehiculosAplicables: 'todos',
          fechaInicio: '2026-12-01',
          fechaFin: '2026-12-31',
        },
      ]);

      const result = await service.calcularPrecioFinal(100, '2026-12-10', '2026-12-12');

      expect(result.precioFinal).toBe(260);
    });

    it('should skip tarifas for vehicles outside the applicable list', async () => {
      mockTarifaRepository.find.mockResolvedValue([
        {
          nombre: 'Solo premium',
          tipo: 'fin_semana',
          porcentaje: 20,
          activa: true,
          vehiculosAplicables: [99],
        },
      ]);

      const result = await service.calcularPrecioFinal(100, '2026-05-02', '2026-05-04', 1);

      expect(result.precioFinal).toBe(200);
      expect(result.tarifasAplicadas).toEqual([]);
    });
  });
});
