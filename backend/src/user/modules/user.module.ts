import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/common/database/entities/user';
import { UserService } from '../services/user.service';
import { UserController } from '../controllers/user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // As entidades do módulo devem ser importadas no forFeature
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
