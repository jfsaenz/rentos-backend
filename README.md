# RentOS Backend API

Backend para RentOS, una plataforma de gestion de alquiler de vehiculos para agencias que necesitan controlar flota, clientes, reservas, tarifas dinamicas, notificaciones, reportes y soporte con IA.

## Estado de entrega

- Backend desarrollado con NestJS y arquitectura por modulos.
- Persistencia con PostgreSQL, TypeORM y entidades relacionales.
- API documentada con Swagger en `/api/docs`.
- Seguridad con JWT, guards, validaciones globales y DTOs con `class-validator`.
- Pruebas unitarias de servicios de negocio con coverage superior al 65%.
- Coleccion de Postman con validaciones basicas en `docs/postman/RentOS.postman_collection.json`.
- Dockerfile y `docker-compose.yml` para levantar backend + PostgreSQL.

## Funcionalidades principales

- Autenticacion: registro, login y perfil con JWT.
- Vehiculos: CRUD, busqueda por estado y cambio de estado.
- Clientes: CRUD, busqueda y scoring.
- Reservas: creacion, disponibilidad, cancelacion y finalizacion.
- Tarifas: reglas activas y calculo de precio final.
- Dashboard y reportes: metricas para operacion.
- Notificaciones: historial/envio de mensajes.
- IA/RAG: asistente de soporte con OpenAI.
- Multi-tenant: datos segmentados por agencia.
- Auditoria, backup y mantenimiento.

## Requisitos

- Node.js 20 recomendado.
- Docker y Docker Compose.
- PostgreSQL 14 si se ejecuta sin Docker.

## Variables de entorno

Copia `.env.example` a `.env` si vas a ejecutar localmente:

```bash
cp .env.example .env
```

Variables clave:

- `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME`
- `JWT_SECRET`, `JWT_EXPIRATION`
- `FRONTEND_URL`, `CORS_ORIGIN`
- `OPENAI_API_KEY` si se va a usar el asistente IA real

## Ejecucion local

```bash
npm install
npm run start:dev
```

La API queda disponible en:

- API: `http://localhost:3001`
- Swagger: `http://localhost:3001/api/docs`
- Health check: `http://localhost:3001/health`

## Ejecucion con Docker

```bash
docker compose up --build
```

Esto levanta:

- PostgreSQL en `localhost:5432`
- Backend en `localhost:3001`

Para detener:

```bash
docker compose down
```

Para reiniciar desde cero con datos limpios:

```bash
docker compose down -v
docker compose up --build
```

## Pruebas y coverage

```bash
npm test
npm run test:cov
```

El coverage esta configurado sobre los servicios centrales de negocio: auth, clientes, vehiculos, reservas, tarifas y RAG. En la ultima verificacion local:

- Test suites: 6 passed
- Tests: 50 passed
- Coverage global: 79.51%

## Postman

Importa la coleccion:

```text
docs/postman/RentOS.postman_collection.json
```

Variables incluidas:

- `baseUrl`: por defecto `http://localhost:3001`
- `token`: se llena automaticamente al ejecutar Login si la respuesta contiene `token` o `access_token`

Flujo sugerido:

1. Health check
2. Register
3. Login
4. Profile
5. Crear/listar vehiculos, clientes, tarifas y reservas
6. Probar RAG chat si `OPENAI_API_KEY` esta configurada

## Justificaciones tecnicas

- NestJS permite separar controladores, servicios y modulos, facilitando pruebas unitarias y crecimiento del backend.
- TypeORM con PostgreSQL da persistencia relacional adecuada para reservas, clientes, usuarios y flota.
- JWT protege endpoints privados y permite que el frontend consuma la API con `Authorization: Bearer <token>`.
- DTOs y `ValidationPipe` reducen entradas invalidas antes de llegar a la logica de negocio.
- Swagger y Postman cubren la documentacion interactiva y la validacion manual de endpoints.
- Docker estandariza la ejecucion para sustentacion y despliegue.
- `bcryptjs` evita fallas de compilacion nativa en entornos donde no se ejecutan scripts de instalacion, manteniendo hashing de contrasenas.

## Entrega

Antes del release final:

```bash
npm run build
npm run test:cov
git tag V2.0-Final
```

Publicar tambien en la wiki del repositorio:

- Historias/funcionalidades por integrante.
- Diagrama o descripcion de arquitectura.
- Retrospectiva individual.
- Retrospectiva grupal.
- Enlaces de frontend, backend y despliegue en la nube.
