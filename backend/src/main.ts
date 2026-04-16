import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuration CORS qui accepte TOUTES les origines (pour les tests)
  app.enableCors({
    origin: '*',  // ⚠️ Accepte toutes les origines
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`✅ Backend running on port ${port}`);
  console.log(`⚠️ CORS: toutes les origines sont autorisées (mode développement)`);
}
bootstrap();