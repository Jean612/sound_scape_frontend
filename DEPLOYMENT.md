# 🌐 SoundScape Frontend - Deployment en Vercel

Guía completa para deployar el frontend de SoundScape en Vercel.

## 📋 Prerrequisitos

1. **Cuenta en Vercel** - Crea una cuenta gratuita en [vercel.com](https://vercel.com)
2. **API deployada** - Tu API de Rails debe estar funcionando en Render
3. **Repositorio en GitHub** - Tu código frontend debe estar en GitHub

## 🚀 Deployment Automático

### Método 1: Conectar desde GitHub (Recomendado)

1. **Importar Proyecto**:
   - Ve a [vercel.com/new](https://vercel.com/new)
   - Conecta tu cuenta de GitHub
   - Selecciona el repositorio `sound_scape_frontend`
   - Vercel detectará automáticamente que es un proyecto Next.js

2. **Configurar Variables de Entorno**:
   En la sección **Environment Variables**, agrega:
   ```
   NEXT_PUBLIC_API_URL=https://soundscape-api.onrender.com/api/v1
   ```
   
3. **Deploy**:
   - Haz clic en **Deploy**
   - Vercel construirá y deployará automáticamente
   - Obtendrás una URL como: `https://soundscape-frontend.vercel.app`

### Método 2: Desde CLI (Alternativo)

```bash
# Instalar Vercel CLI
npm install -g vercel

# En el directorio del frontend
cd sound_scape_front

# Configurar variables de entorno
cp .env.example .env.local
# Edita .env.local con tu URL de API

# Deploy
vercel --prod
```

## ⚙️ Configuración Post-Deployment

### 1. Actualizar CORS en la API
Después del deployment, actualiza las variables de entorno en Render:

```
CORS_ALLOWED_ORIGINS=https://tu-frontend.vercel.app
```

### 2. Configurar Dominio Personalizado (Opcional)
1. En Vercel Dashboard → Settings → Domains
2. Agrega tu dominio personalizado
3. Actualiza DNS según las instrucciones de Vercel

## 🔧 Troubleshooting

### Error: "API calls failing"
1. Verifica que `NEXT_PUBLIC_API_URL` esté configurada correctamente
2. Asegúrate de que la API esté funcionando: `curl https://tu-api.onrender.com/up`
3. Verifica CORS en la API

### Error: "Build failed"
1. Revisa los logs de build en Vercel Dashboard
2. Asegúrate de que `npm run build` funcione localmente
3. Verifica que todas las dependencias estén en `package.json`

### Error: "Environment variables not working"
1. Las variables deben empezar con `NEXT_PUBLIC_` para estar disponibles en el browser
2. Redeploya después de cambiar variables de entorno
3. Verifica que no haya espacios extra en los valores

## 🔄 Auto-Deploy

Una vez configurado, Vercel automáticamente:
- ✅ Detecta cambios en GitHub
- ✅ Construye el proyecto
- ✅ Deploya la nueva versión
- ✅ Actualiza la URL en vivo

## 📱 URLs y Testing

### URLs principales:
- **Producción**: `https://tu-frontend.vercel.app`
- **Preview**: Cada PR genera una URL de preview

### Testing checklist:
- [ ] Landing page carga correctamente
- [ ] Registro de usuario funciona
- [ ] Verificación OTP funciona
- [ ] Login funciona y redirige al dashboard
- [ ] Dashboard muestra playlists (vacías inicialmente)
- [ ] Logout funciona y redirige al landing

## 🔗 Integración Completa

### Flujo de la aplicación:
```
Usuario → Frontend (Vercel) → API (Render) → PostgreSQL (Render)
```

### URLs finales:
- **Frontend**: `https://soundscape-frontend.vercel.app`
- **API**: `https://soundscape-api.onrender.com`
- **API Docs**: `https://soundscape-api.onrender.com/api/v1`

## 💡 Optimizaciones de Producción

1. **Performance**:
   - Vercel optimiza automáticamente imágenes
   - CDN global para carga rápida
   - Compresión automática

2. **SEO**:
   - Meta tags configurados en layout.tsx
   - URLs amigables con `/dashboard`, `/playlists/[id]`

3. **Seguridad**:
   - HTTPS por defecto
   - Headers de seguridad automáticos
   - Variables de entorno protegidas

## 🆘 Soporte

Si tienes problemas:
1. Revisa los logs en Vercel Dashboard → Functions
2. Verifica que la API esté respondiendo
3. Prueba localmente con `npm run dev`
4. Verifica que todas las variables de entorno estén configuradas