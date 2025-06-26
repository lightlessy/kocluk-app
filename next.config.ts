/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  allowedDevOrigins: [
    'http://192.168.56.1:3000',  // PC IP ve portun
    'http://<mobilin-ip-adresi>:3000', // isteğe bağlı, bazen faydalı
  ],
}

module.exports = nextConfig;
