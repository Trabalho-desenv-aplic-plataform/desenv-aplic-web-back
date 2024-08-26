import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/modules/user.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { UserService } from 'src/user/services/user.service';

@Module({
  imports: [ 
    ConfigModule.forRoot(),
    UserModule, 
    PassportModule,
    JwtModule.register({
      privateKey: process.env.JWT_SECRET_KEY, // Vai ser responsável pela segurança do token
      signOptions: { expiresIn: '60s'}// Define que o token vai durar 60 segundos
    }) 
  ],
  providers: [AuthService, LocalStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
