import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contatos } from 'src/common/database/entities/contatos';
import { ContatosService } from '../service/contatos/contatos.service';
import { ContatosController } from '../controller/contatos/contatos.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Contatos])],
    providers: [ContatosService],
    controllers: [ContatosController]
})
export class ContatosModule {}
