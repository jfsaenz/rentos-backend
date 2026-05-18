# Prompt para Lovable - Presentacion RentOS

Crear una presentacion web responsive y elegante para sustentar RentOS, una aplicacion de gestion de alquiler de vehiculos. Debe sentirse como una demo de producto real, no como landing generica.

Objetivo: explicar el problema, mostrar la solucion, evidenciar integracion frontend + backend, pruebas, Swagger, Postman, Docker, despliegue cloud y piezas publicitarias.

Publico objetivo: agencias de renta de vehiculos en Colombia, equipos operativos que necesitan controlar flota, reservas, tarifas y clientes desde mobile y desktop.

Estructura:

1. Portada: "RentOS" como titulo principal, subtitulo "Gestion inteligente para alquiler de vehiculos", espacio grande para imagen hero real del producto o mockup mobile.
2. Problema: tarjetas breves sobre desorden operativo, reservas manuales, poca visibilidad de flota, errores de disponibilidad y perdida de clientes.
3. Solucion: explicar RentOS con flujo visual: cliente, vehiculo, reserva, tarifa, pago/notificacion, dashboard.
4. Producto: seccion con 3 espacios grandes para screenshots completos: mobile home, pantalla de reservas y dashboard.
5. Arquitectura: diagrama claro frontend -> backend NestJS -> PostgreSQL -> OpenAI/RAG -> email/notificaciones.
6. Backend: bloque con Swagger, modulos, seguridad JWT, validaciones, TypeORM y Docker.
7. Pruebas: bloque para colocar screenshot de coverage, Postman runner y Swagger. Mostrar texto destacado: "Coverage backend: 79.51%".
8. Integracion frontend/backend: seccion de demo mobile con instrucciones visuales para mostrar DevTools Network abierto validando llamadas HTTP reales.
9. Despliegue: espacios para enlaces de repositorio frontend, repositorio backend y app desplegada en cloud.
10. Video publicitario: storyboard de maximo 30 segundos, con problema, solucion, resultado y call to action.
11. Cinco piezas graficas: galeria 5: "Agenda sin llamadas", "Flota bajo control", "Precios inteligentes", "Reservas en segundos", "IA para soporte". Cada pieza debe tener espacio de imagen completa y copy corto.
12. Cierre: decisiones tecnicas, aprendizajes y mejoras futuras.

Estilo visual:

- Interfaz moderna, limpia, profesional y operativa.
- No usar estetica de marketing vacia; priorizar screenshots, paneles tecnicos y demo.
- Paleta balanceada: fondo claro, acentos verde/azul, texto oscuro, estados con colores funcionales.
- Layout mobile-first, con modo desktop tambien pulido.
- Dejar placeholders visibles para imagenes completas con proporciones 16:9 y 9:16.

Contenido tecnico que debe aparecer:

- Backend: NestJS, TypeScript, PostgreSQL, TypeORM, Swagger, JWT, class-validator, Jest, Docker.
- Modulos: auth, vehiculos, clientes, reservas, tarifas, dashboard, reportes, notificaciones, RAG IA, tenants, audit, backup.
- Endpoints destacados: `/auth/login`, `/vehiculos`, `/clientes`, `/reservas`, `/tarifas/calcular-precio`, `/dashboard/metricas`, `/rag/chat`, `/api/docs`.
- Coverage: 79.51%, 50 tests passing.

Espacios editables:

- [URL_REPOSITORIO_FRONTEND]
- [URL_REPOSITORIO_BACKEND]
- [URL_APP_DESPLEGADA]
- [URL_BACKEND_DESPLEGADO]
- [NOMBRE_EQUIPO]
- [INTEGRANTES]
- [SCREENSHOT_MOBILE_HOME]
- [SCREENSHOT_NETWORK_TAB]
- [SCREENSHOT_SWAGGER]
- [SCREENSHOT_POSTMAN]
- [SCREENSHOT_COVERAGE]
- [PIEZA_GRAFICA_1]
- [PIEZA_GRAFICA_2]
- [PIEZA_GRAFICA_3]
- [PIEZA_GRAFICA_4]
- [PIEZA_GRAFICA_5]

Generar tambien textos cortos para el video publicitario de 30 segundos:

- 0-5s: "Tus reservas no deberian depender de chats y hojas de calculo."
- 5-12s: "RentOS conecta flota, clientes, tarifas y disponibilidad en una sola app."
- 12-20s: "Confirma reservas, calcula precios y revisa metricas en tiempo real."
- 20-27s: "Con IA para soporte y backend seguro en NestJS."
- 27-30s: "RentOS: renta mas rapido, opera con control."
