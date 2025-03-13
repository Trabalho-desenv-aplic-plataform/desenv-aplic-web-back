import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/modules/user.module';
import { jwtConstants } from '../constants/constants';
import { AuthController } from '../controllers/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '../services/auth/auth.service';


@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
          secret: 'MySecretKey', 
          signOptions: { expiresIn: '1h' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService]
})
export class AuthModule {}
