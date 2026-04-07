import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

export async function seedDatabase(dataSource: DataSource) {
  console.log('🌱 Starting database seed...');

  // Seed Users
  const userRepository = dataSource.getRepository('User');
  const adminExists = await userRepository.findOne({ where: { email: 'admin@rentos.com' } });
  
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await userRepository.save({
      email: 'admin@rentos.com',
      password: hashedPassword,
      nombre: 'Administrador',
      rol: 'admin',
    });
    console.log('✅ Admin user created');
  }

  // Seed Vehiculos
  const vehiculoRepository = dataSource.getRepository('Vehiculo');
  const vehiculosCount = await vehiculoRepository.count();
  
  if (vehiculosCount === 0) {
    const vehiculos = [
      {
        marca: 'Yamaha',
        modelo: 'MT-03',
        anio: 2023,
        placa: 'KTC-112',
        kilometraje: 15400,
        proximoMantenimiento: 500,
        estado: 'available',
        tipo: 'Naked',
        precioDia: 45,
        foto: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=400',
      },
      {
        marca: 'Honda',
        modelo: 'CB650R',
        anio: 2022,
        placa: 'LMN-657',
        kilometraje: 5200,
        proximoMantenimiento: 1200,
        estado: 'maintenance',
        tipo: 'Naked',
        precioDia: 60,
        foto: 'https://images.unsplash.com/photo-1615172282427-9a5752d358cd?q=80&w=400',
      },
      {
        marca: 'BMW',
        modelo: 'G310 GS',
        anio: 2023,
        placa: 'BMW-990',
        kilometraje: 8100,
        proximoMantenimiento: 900,
        estado: 'available',
        tipo: 'Adventure',
        precioDia: 55,
        foto: 'https://images.unsplash.com/photo-1622185135505-2d795003994a?q=80&w=400',
      },
      {
        marca: 'Ducati',
        modelo: 'Scrambler',
        anio: 2021,
        placa: 'DUC-777',
        kilometraje: 1200,
        proximoMantenimiento: 4000,
        estado: 'rented',
        tipo: 'Cruiser',
        precioDia: 85,
        foto: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?q=80&w=400',
      },
      {
        marca: 'Kawasaki',
        modelo: 'Ninja 400',
        anio: 2023,
        placa: 'KWK-400',
        kilometraje: 3500,
        proximoMantenimiento: 1500,
        estado: 'available',
        tipo: 'Sport',
        precioDia: 50,
        foto: 'https://images.unsplash.com/photo-1547933134-2475097486f0?q=80&w=400',
      },
    ];

    await vehiculoRepository.save(vehiculos);
    console.log(`✅ ${vehiculos.length} vehiculos created`);
  }

  // Seed Clientes
  const clienteRepository = dataSource.getRepository('Cliente');
  const clientesCount = await clienteRepository.count();
  
  if (clientesCount === 0) {
    const clientes = [
      {
        nombre: 'Juan Pérez',
        email: 'juan.perez@example.com',
        telefono: '3001234567',
        numeroDocumento: '1234567890',
        tipoDocumento: 'CC',
        direccion: 'Calle 123 #45-67',
        ciudad: 'Bogotá',
        licenciaConduccion: 'LIC123456',
        score: 100,
        reservasTotales: 0,
        totalGastado: 0,
        cancelaciones: 0,
      },
      {
        nombre: 'María García',
        email: 'maria.garcia@example.com',
        telefono: '3009876543',
        numeroDocumento: '9876543210',
        tipoDocumento: 'CC',
        direccion: 'Carrera 45 #12-34',
        ciudad: 'Medellín',
        licenciaConduccion: 'LIC654321',
        score: 95,
        reservasTotales: 5,
        totalGastado: 1250,
        cancelaciones: 1,
      },
    ];

    await clienteRepository.save(clientes);
    console.log(`✅ ${clientes.length} clientes created`);
  }

  // Seed Tarifas
  const tarifaRepository = dataSource.getRepository('Tarifa');
  const tarifasCount = await tarifaRepository.count();
  
  if (tarifasCount === 0) {
    const tarifas = [
      {
        nombre: 'Descuento Largo Plazo',
        tipo: 'descuento_largo',
        porcentaje: -15,
        activa: true,
        vehiculosAplicables: 'todos',
      },
      {
        nombre: 'Recargo Fin de Semana',
        tipo: 'fin_semana',
        porcentaje: 20,
        activa: true,
        vehiculosAplicables: 'todos',
      },
      {
        nombre: 'Temporada Alta Diciembre',
        tipo: 'temporada_alta',
        porcentaje: 30,
        activa: true,
        vehiculosAplicables: 'todos',
        fechaInicio: '2026-12-01',
        fechaFin: '2026-12-31',
      },
    ];

    await tarifaRepository.save(tarifas);
    console.log(`✅ ${tarifas.length} tarifas created`);
  }

  console.log('🎉 Database seed completed!');
}
