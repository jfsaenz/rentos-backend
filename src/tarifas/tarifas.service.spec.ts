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
