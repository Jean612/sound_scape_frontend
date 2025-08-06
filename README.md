# 🎵 SoundScape Frontend

Una aplicación web moderna y elegante para gestionar tu música con inteligencia artificial. Construida con Next.js 14, TypeScript y Tailwind CSS.

## ✨ Características

- 🤖 **Búsqueda Inteligente**: Encuentra canciones usando descripciones naturales
- 📱 **Responsive Design**: Diseño moderno que funciona en todos los dispositivos
- 🎨 **Tema Claro**: Interfaz limpia con verde pastel y blancos
- ⚡ **Rendimiento Optimizado**: Carga rápida y navegación fluida
- 🔐 **Autenticación Segura**: Sistema de login con JWT tokens
- 🎵 **Gestión de Playlists**: Crea y organiza tus listas de reproducción

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Styling**: Tailwind CSS
- **Estado**: Zustand
- **Datos**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Iconos**: Lucide React

## 🚀 Instalación y Desarrollo

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Configurar variables de entorno**:
   ```bash
   cp .env.example .env.local
   ```

3. **Iniciar servidor de desarrollo**:
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**:
   ```
   http://localhost:3001
   ```

**Nota**: La aplicación está configurada para ejecutarse siempre en el puerto **3001** para evitar conflictos con la API Rails que corre en el puerto 3000.

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router pages
│   ├── (auth)/            # Rutas de autenticación
│   ├── dashboard/         # Dashboard principal
│   ├── playlists/         # Gestión de playlists
│   ├── search/           # Búsqueda AI
│   └── layout.tsx        # Layout principal
├── components/           # Componentes reutilizables
│   ├── ui/              # Componentes base
│   ├── forms/           # Formularios
│   └── providers.tsx    # Providers globales
├── lib/                 # Configuración y utilidades
│   ├── api.ts          # Cliente API
│   ├── stores/         # Stores Zustand
│   └── utils.ts        # Utilidades
└── types/              # Tipos TypeScript
```

## 🎨 Tema y Diseño

### Paleta de Colores
- **Verde Principal**: `#22c55e` (Emerald 500)
- **Verde Pastel**: `#86efac` (Emerald 300)
- **Verde Claro**: `#f0fdf4` (Emerald 50)
- **Texto**: `#0f172a` (Slate 900)
- **Fondo**: `#ffffff` (Blanco)

### Filosofía de Diseño
- **Minimalista**: Interfaz limpia sin distracciones
- **Accesible**: Contrastes apropiados y navegación por teclado
- **Moderno**: Elementos glassmorphism y animaciones suaves
- **Responsive**: Funciona perfectamente en móvil y desktop

## 🔗 API Integration

La aplicación se conecta con la API de Rails en:
- **Desarrollo**: `http://localhost:3000/api/v1`
- **Producción**: Configurar `NEXT_PUBLIC_API_URL`

### Endpoints Utilizados
- `POST /auth/login` - Autenticación
- `POST /auth/register` - Registro
- `GET /playlists` - Obtener playlists
- `POST /ai_search` - Búsqueda inteligente
- `POST /playlists/:id/add_ai_song` - Agregar canción AI

## 📝 Scripts Disponibles

```bash
# Desarrollo (puerto 3001)
npm run dev

# Build para producción
npm run build

# Iniciar aplicación en producción (puerto 3001)
npm start

# Linting
npm run lint
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

---

Hecho con ❤️ para los amantes de la música