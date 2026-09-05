# Lista de Tareas (Task Tracker)

- [x] **Fase 1: Configuración Inicial**
  - [x] Inicializar proyecto Next.js con Tailwind y TypeScript.
  - [x] Configurar Prisma ORM.
  - [x] Conectar base de datos PostgreSQL alojada en Supabase.

- [x] **Fase 2: Arquitectura de Base de Datos**
  - [x] Crear esquema de Usuarios (Autenticación).
  - [x] Crear tablas de Medios (Series, Películas, Juegos, Música, Libros) incluyendo columna JSONB para metadatos completos.
  - [x] Crear tablas de Valoraciones y Sistema de Puntos (1000 pts).
  - [x] Crear tabla de Seguimiento Episódico para Series (SeasonChart).

- [x] **Fase 3: Integración de APIs de Terceros**
  - [x] Servicio API de TMDB (Películas y Series).
  - [x] Servicio API de Música (Apple Music / iTunes).
  - [x] Servicio API de Libros (OpenLibrary).
  - [x] Servicio API de Videojuegos (Speedrun.com + Wikidata).

- [x] **Fase 4: Core UI & Layout**
  - [x] Configurar layout principal (Sidebar colapsable, Navegación).
  - [x] Crear tema "Dark Mode Glassmorphism" con colores por módulo.
  - [x] Dashboard principal con métricas.

- [x] **Fase 5: Flujos de Usuario Principales**
  - [x] Buscador global unificado (consultando todas las APIs activas).
  - [x] Formularios de valoración (UI con sliders granulares y topes matemáticos de 1000 pts).
  - [x] Guardado robusto en base de datos.

- [x] **Fase 6: Videojuegos & SeasonChart**
  - [x] Añadir soporte para Videojuegos en Buscador, Formulario y Base de datos.
  - [x] Añadir ranking de Videojuegos en el Dashboard.
  - [x] Generación de gráficas por episodios para Series (SeasonChart) con Recharts y tabla de calor (Heatmap).
  - [x] Integración de Wikidata para enriquecer metadatos (ej. Desarrollador y Género).

- [x] **Fase 7: Álbumes (Trackgraph)**
  - [x] Módulo de Álbumes Musicales.
  - [x] Lógica para valorar canción por canción de un álbum (similar al SeasonChart).
  - [x] Visualización de la evolución de calidad a lo largo del álbum.

- [ ] **Fase 8: Metadatos Extendidos y Estadísticas**
  - [ ] **Métricas Globales (Todos los módulos):** Estado, Fechas de Consumo, Veces Revisitado.
  - [ ] **Videojuegos:** Horas Jugadas, Nivel Completado, Plataforma, Dificultad, Logros.
  - [ ] **Series y Películas:** Días de Binge, Formato, Punto de Abandono, Compañía.
  - [ ] **Música:** Conteo de Reproducciones, Tempo (BPM), Vibra, Mes de Descubrimiento.
  - [ ] **Libros:** Ritmo de Lectura, Volumen (páginas), Formato, Idioma.
  - [ ] Generación de panel de estadísticas globales/personales.

- [ ] **Fase 9: Detalles Expandidos de Obra**
  - [x] Motor de extracción de Códigos P de Wikidata para TODAS las categorías (películas, libros, canciones, series).
  - [ ] Obtener e inyectar el Elenco (Cast/Crew) para Películas y Series desde TMDB.
  - [ ] Rediseñar la pantalla de la obra (`/rate/[type]/[id]`) para mostrar las métricas globales del usuario sobre la obra.

- [ ] **Fase 10: Perfiles y Social**
  - [ ] Perfiles de usuario públicos.
  - [ ] Comparador de tablas de líder entre usuarios.
