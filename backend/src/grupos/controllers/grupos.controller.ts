import { Body, Controller, Delete, Get, Logger, Param, Post } from '@nestjs/common';
import { GruposService } from '../services/grupos/grupos.service';
import { Grupos } from 'src/common/database/entities/grupos';

@Controller('grupos')
export class GruposController {
    private readonly logger = new Logger(GruposController.name);
    constructor(private readonly grupoService: GruposService) {}

    @Get()
    findAll(): Promise<Grupos[]> {
        return this.grupoService.findAll();
    }

    @Post()
    async create(@Body() grupos: Grupos): Promise<Grupos>{
        try{
            await this.grupoService.create(grupos);
            return grupos;

        } catch (error){
            this.logger.error(`Falha em criar Grupo`, error.stack);
            throw error;
        }
    }
}
