import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grupos } from 'src/common/database/entities/grupos';
import { GruposService } from '../services/grupos/grupos.service';
import { GruposController } from '../controllers/grupos.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Grupos])],
    providers: [GruposService],
    controllers: [GruposController]
})
export class GruposModule {}
