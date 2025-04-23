import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './common/database/database.module';
import { UserModule } from './user/modules/user.module';
import { GruposModule } from './grupos/modules/grupos.module';
import { GruposController } from './grupos/controllers/grupos.controller';
import { AuthModule } from './auth/modules/auth.module';
import { ContatosModule } from './contatos/module/contatos.module';
import { BotModule } from './bot/bot.module';
import { LoggerMiddleware } from './Logger.Middleware';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    GruposModule,
    ContatosModule,
    BotModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('auth'); 
  }
}
