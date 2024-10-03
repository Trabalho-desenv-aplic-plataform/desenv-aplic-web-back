import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './common/database/database.module';
import { UserModule } from './user/modules/user.module';
import { GruposModule } from './grupos/modules/grupos.module';
import { GruposController } from './grupos/controllers/grupos.controller';
import { AuthModule } from './auth/modules/auth.module';
import { ContatosModule } from './contatos/module/contatos.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    GruposModule,
    ContatosModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
