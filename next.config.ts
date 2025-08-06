import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuración del puerto por defecto
  experimental: {
    // Otras configuraciones experimentales aquí
  },
  // Optimizaciones de producción
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
