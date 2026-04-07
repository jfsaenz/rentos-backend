import { Test, TestingModule } from '@nestjs/testing';
import { TarifasService } from './tarifas.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tarifa } from './entities/tarifa.entity';

describe('TarifasService', () => {
  let service: TarifasService;

  const mockTarifaRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
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

  describe('calcularPrecio', () => {
    it('should calculate base price for 3 days', async () => {
      mockTarifaRepository.find.mockResolvedValue([]);

      const result = await service.calcularPrecio({
        precioBase: 50,
        fechaInicio: '2026-05-01',
        fechaFin: '2026-05-04',
      });

      expect(result.precioFinal).toBe(150); // 50 * 3 days
      expect(result.dias).toBe(3);
    });

    it('should apply 15% discount for 7+ days', async () => {
      const tarifas = [
        {
          id: 'tar-1',
          tipo: 'descuento_largo',
          porcentaje: -15,
          activa: true,
          vehiculosAplicables: 'todos',
        },
      ];

      mockTarifaRepository.find.mockResolvedValue(tarifas);

      const result = await service.calcularPrecio({
        precioBase: 50,
        fechaInicio: '2026-05-01',
        fechaFin: '2026-05-08',
      });

      expect(result.dias).toBe(7);
      // 50 * 7 = 350, with 15% discount = 297.5 rounded to 298
      expect(result.precioFinal).toBeLessThan(350);
      expect(result.descuentos).toBeGreaterThan(0);
    });

    it('should apply 20% weekend surcharge', async () => {
      const tarifas = [
        {
          id: 'tar-2',
          tipo: 'fin_semana',
          porcentaje: 20,
          activa: true,
          vehiculosAplicables: 'todos',
        },
      ];

      mockTarifaRepository.find.mockResolvedValue(tarifas);

      // Saturday to Sunday
      const result = await service.calcularPrecio({
        precioBase: 50,
        fechaInicio: '2026-05-02', // Saturday
        fechaFin: '2026-05-04', // Monday
      });

      expect(result.recargos).toBeGreaterThan(0);
    });

    it('should apply 30% high season surcharge', async () => {
      const tarifas = [
        {
          id: 'tar-3',
          tipo: 'temporada_alta',
          porcentaje: 30,
          activa: true,
          vehiculosAplicables: 'todos',
          fechaInicio: '2026-12-01',
          fechaFin: '2026-12-31',
        },
      ];

      mockTarifaRepository.find.mockResolvedValue(tarifas);

      const result = await service.calcularPrecio({
        precioBase: 50,
        fechaInicio: '2026-12-15',
        fechaFin: '2026-12-20',
      });

      expect(result.recargos).toBeGreaterThan(0);
      expect(result.precioFinal).toBeGreaterThan(250); // Base would be 250
    });

    it('should only apply tarifas to specific vehicles', async () => {
      const tarifas = [
        {
          id: 'tar-4',
          tipo: 'descuento_largo',
          porcentaje: -15,
          activa: true,
          vehiculosAplicables: [1, 2, 3],
        },
      ];

      mockTarifaRepository.find.mockResolvedValue(tarifas);

      // Should apply to vehicle 1
      const result1 = await service.calcularPrecio({
        precioBase: 50,
        fechaInicio: '2026-05-01',
        fechaFin: '2026-05-08',
        vehiculoId: 1,
      });

      expect(result1.descuentos).toBeGreaterThan(0);

      // Should NOT apply to vehicle 99
      const result2 = await service.calcularPrecio({
        precioBase: 50,
        fechaInicio: '2026-05-01',
        fechaFin: '2026-05-08',
        vehiculoId: 99,
      });

      expect(result2.descuentos).toBe(0);
    });
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
});
