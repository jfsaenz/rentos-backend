# RentOS Backend API

Backend completo para el sistema de gestión de alquiler de vehículos RentOS, construido con NestJS, TypeScript y PostgreSQL.

## 🚀 Características

- **Autenticación JWT** - Sistema completo de registro y login
- **Multi-tenant** - Soporte para múltiples agencias
- **CRUD Completo** - Vehículos, Clientes, Reservas, Tarifas
- **RAG con IA** - Asistente inteligente con OpenAI
- **Notificaciones** - Sistema de emails automáticos
- **Dashboard** - Métricas y analytics en tiempo real
- **Swagger** - Documentación automática de API
- **Tests** - Pruebas unitarias completas

## 📋 Requisitos

- Node.js 20+
- PostgreSQL 14+
- npm o yarn

## 🛠️ Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Ejecutar migraciones (automático en desarrollo)
npm run start:dev
```

## 🏃 Ejecución

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod

# Tests
npm test
npm run test:watch
npm run test:cov
```

## 📚 Documentación API

Una vez iniciado el servidor, accede a:
- Swagger UI: `http://localhost:3001/api/docs`

## 🗄️ Estructura de Base de Datos

### Tablas Principales

- **users** - Usuarios del sistema
- **vehiculos** - Flota de vehículos
- **clientes** - Base de datos de clientes
- **reservas** - Reservas y alquileres
- **tarifas** - Reglas de tarifas dinámicas
- **notificaciones** - Historial de notificaciones
- **tenants** - Agencias multi-tenant
- **conversations** - Historial de chat con IA

## 🔐 Autenticación

Todas las rutas (excepto `/auth/login` y `/auth/register`) requieren token JWT:

```bash
Authorization: Bearer <token>
```

## 📡 Endpoints Principales

### Auth
- `POST /auth/register` - Registrar usuario
- `POST /auth/login` - Iniciar sesión
- `GET /auth/profile` - Perfil del usuario

### Vehículos
- `GET /vehiculos` - Listar vehículos
- `POST /vehiculos` - Crear vehículo
- `GET /vehiculos/:id` - Obtener vehículo
- `PATCH /vehiculos/:id` - Actualizar vehículo
- `DELETE /vehiculos/:id` - Eliminar vehículo

### Clientes
- `GET /clientes` - Listar clientes
- `POST /clientes` - Crear cliente
- `GET /clientes/search` - Buscar clientes
- `PATCH /clientes/:id` - Actualizar cliente

### Reservas
- `GET /reservas` - Listar reservas
- `POST /reservas` - Crear reserva
- `POST /reservas/verificar-disponibilidad` - Verificar disponibilidad
- `PATCH /reservas/:id/cancelar` - Cancelar reserva

### RAG / IA
- `POST /rag/chat` - Chat con asistente IA
- `GET /rag/conversations` - Historial de conversaciones

### Dashboard
- `GET /dashboard/metricas` - Métricas del dashboard
- `GET /dashboard/ingresos` - Análisis de ingresos

## 🧪 Tests

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

## 🐳 Docker

```bash
# Build
docker build -t rentos-backend .

# Run
docker run -p 3001:3001 rentos-backend
```

## 📝 Variables de Entorno

Ver `.env.example` para todas las variables requeridas.

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

MIT

## 👥 Equipo

- Esteban
- Saenz
- Miguel
