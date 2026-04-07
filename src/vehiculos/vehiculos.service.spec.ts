import { Test, TestingModule } from '@nestjs/testing';
import { VehiculosService } from './vehiculos.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Vehiculo } from './entities/vehiculo.entity';
import { NotFoundException } from '@nestjs/common';

describe('VehiculosService', () => {
  let service: VehiculosService;

  const mockVehiculoRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehiculosService,
        {
          provide: getRepositoryToken(Vehiculo),
          useValue: mockVehiculoRepository,
        },
      ],
    }).compile();

    service = module.get<VehiculosService>(VehiculosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all vehiculos', async () => {
      const mockVehiculos = [
        { id: 1, marca: 'Yamaha', modelo: 'MT-03', estado: 'available' },
        { id: 2, marca: 'Honda', modelo: 'CB650R', estado: 'rented' },
      ];

      mockVehiculoRepository.find.mockResolvedValue(mockVehiculos);

      const result = await service.findAll();

      expect(result).toEqual(mockVehiculos);
      expect(mockVehiculoRepository.find).toHaveBeenCalled();
    });

    it('should filter by estado when provided', async () => {
      const mockVehiculos = [
        { id: 1, marca: 'Yamaha', modelo: 'MT-03', estado: 'available' },
      ];

      mockVehiculoRepository.find.mockResolvedValue(mockVehiculos);

      const result = await service.findAll('available');

      expect(result).toEqual(mockVehiculos);
      expect(mockVehiculoRepository.find).toHaveBeenCalledWith({
        where: { estado: 'available' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a vehiculo by id', async () => {
      const mockVehiculo = { id: 1, marca: 'Yamaha', modelo: 'MT-03' };

      mockVehiculoRepository.findOne.mockResolvedValue(mockVehiculo);

      const result = await service.findOne(1);

      expect(result).toEqual(mockVehiculo);
      expect(mockVehiculoRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if vehiculo not found', async () => {
      mockVehiculoRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new vehiculo', async () => {
      const createDto = {
        marca: 'Yamaha',
        modelo: 'MT-03',
        anio: 2023,
        placa: 'ABC123',
        kilometraje: 0,
        proximoMantenimiento: 5000,
        estado: 'available' as const,
        tipo: 'Naked' as const,
        precioDia: 45,
        foto: 'https://example.com/photo.jpg',
      };

      const savedVehiculo = { id: 1, ...createDto };

      mockVehiculoRepository.create.mockReturnValue(createDto);
      mockVehiculoRepository.save.mockResolvedValue(savedVehiculo);

      const result = await service.create(createDto);

      expect(result).toEqual(savedVehiculo);
      expect(mockVehiculoRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockVehiculoRepository.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a vehiculo', async () => {
      const existingVehiculo = {
        id: 1,
        marca: 'Yamaha',
        modelo: 'MT-03',
        estado: 'available',
      };

      const updateDto = { estado: 'maintenance' as const };
      const updatedVehiculo = { ...existingVehiculo, ...updateDto };

      mockVehiculoRepository.findOne.mockResolvedValue(existingVehiculo);
      mockVehiculoRepository.save.mockResolvedValue(updatedVehiculo);

      const result = await service.update(1, updateDto);

      expect(result).toEqual(updatedVehiculo);
      expect(mockVehiculoRepository.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a vehiculo', async () => {
      const vehiculo = { id: 1, marca: 'Yamaha', modelo: 'MT-03' };

      mockVehiculoRepository.findOne.mockResolvedValue(vehiculo);
      mockVehiculoRepository.remove.mockResolvedValue(vehiculo);

      await service.remove(1);

      expect(mockVehiculoRepository.remove).toHaveBeenCalledWith(vehiculo);
    });
  });
});
