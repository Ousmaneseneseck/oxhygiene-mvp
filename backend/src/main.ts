import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuration CORS pour accepter les requêtes du frontend (Netlify et local)
  app.enableCors({
    origin: [
      'https://oxhygiene-mvp.netlify.app',
      'https://oxhygiene-platform.netlify.app',
      'https://oxhygiene-portal.netlify.app',
      'http://localhost:3001',
      'http://localhost:3000',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  // Utiliser le port fourni par Render (process.env.PORT) ou 3000 par défaut
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`✅ Backend running on port ${port}`);
  console.log(`✅ CORS autorisé pour: Netlify (mvp, platform, portal) et localhost`);
}
bootstrap();