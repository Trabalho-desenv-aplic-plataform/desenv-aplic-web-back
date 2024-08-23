import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('API Easy Zap')
    .setDescription('API do projeto de plataformas de desenvolvimento web')
    .setVersion('1.0')
    .addTag('endpoints')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: 'http://localhost:4200', // Substitua pelo endereço da sua aplicação Angular
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Habilita cookies, se necessário
  });

  await app.listen(3000);
}
bootstrap();
