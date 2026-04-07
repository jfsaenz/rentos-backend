import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security: Helmet (headers de seguridad)
  // app.use(helmet()); // Descomentar si instalas helmet

  // Compression
  app.use(compression());

  // Enable CORS - Allow multiple origins for development and production
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.CORS_ORIGIN,
    process.env.FRONTEND_URL,
  ].filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Check if origin is allowed
      if (allowedOrigins.some(allowed => origin.startsWith(allowed))) {
        callback(null, true);
      } else {
        // For development, allow all localhost origins
        if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
          callback(null, true);
        } else {
          console.warn(`CORS blocked origin: ${origin}`);
          callback(new Error('Not allowed by CORS'));
        }
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('RentOS API')
    .setDescription('API para el sistema de gestión de alquiler de vehículos RentOS')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('health', 'Health check endpoints')
    .addTag('auth', 'Autenticación y autorización')
    .addTag('vehiculos', 'Gestión de vehículos')
    .addTag('clientes', 'Gestión de clientes')
    .addTag('reservas', 'Sistema de reservas')
    .addTag('tarifas', 'Tarifas dinámicas')
    .addTag('dashboard', 'Métricas y estadísticas')
    .addTag('rag', 'Asistente IA con RAG')
    .addTag('notificaciones', 'Sistema de notificaciones')
    .addTag('tenants', 'Multi-tenancy')
    .addTag('mantenimiento', 'Gestión de mantenimiento')
    .addTag('audit', 'Auditoría de cambios')
    .addTag('reports', 'Reportes y análisis')
    .addTag('backup', 'Backup y restauración')
    .setContact(
      'RentOS Team',
      'https://github.com/rentos',
      'contact@rentos.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log('');
  console.log('🚀 ============================================');
  console.log(`🚀 RentOS Backend running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
  console.log(`🌐 CORS enabled for: ${allowedOrigins.join(', ')}`);
  console.log(`🔒 Security: Validation, Logging, Error Handling`);
  console.log(`📊 Features: Audit, Reports, Backup, RAG AI`);
  console.log('🚀 ============================================');
  console.log('');
}
bootstrap();
