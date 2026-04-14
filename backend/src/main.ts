import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Activer CORS pour accepter les requêtes du frontend
  app.enableCors({
    origin: [
      'https://oxhygiene-platform.netlify.app',
      'https://oxygene-app.netlify.app',
      'https://oxhygiene-mvp.netlify.app',
      'http://localhost:3001',
      'http://localhost:3000',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`✅ Backend running on port ${port}`);
}
bootstrap();