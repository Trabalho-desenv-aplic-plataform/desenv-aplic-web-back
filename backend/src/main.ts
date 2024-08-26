import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

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

  app.useGlobalPipes(new ValidationPipe({ whitelist: true })); // Garantir que execute uma exceção quando houver erros
  // app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })); // Garantir que execute uma exceção quando houver erros
  // whitelist : 
  // remove (ou "filtra") automaticamente qualquer propriedade que não esteja explicitamente 
  // definida nos DTOs usados para validação. Ou seja, se o cliente enviar dados extras que não
  // fazem parte do DTO, eles serão removidos antes que o controlador os receba.

  // forbidNonWhitelisted
  // Com esta opção ativada, em vez de apenas remover as propriedades não permitidas, o NestJS 
  // lançará um erro (BadRequestException) se o cliente enviar propriedades que não estão no DTO. Isso força o cliente a enviar apenas dados válidos.
  await app.listen(3000);
}
bootstrap();
