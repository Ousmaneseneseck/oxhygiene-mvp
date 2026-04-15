import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Activer CORS pour accepter les requêtes du frontend
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'https://oxhygiene-mvp.netlify.app',
        'https://oxhygiene-platform.netlify.app',
        'https://oxhygiene-portal.netlify.app',
        'http://localhost:3001',
        'http://localhost:3000',
      ];
      // Permettre les requêtes sans origin (ex: Postman, curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`❌ CORS bloqué pour l'origine: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`✅ Backend running on port ${port}`);
  console.log(`✅ CORS autorisé pour: Netlify (mvp, platform, portal) et localhost`);
}
bootstrap();