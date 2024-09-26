import { Body, Controller, Delete, Get, Logger, Param, Post } from '@nestjs/common';
import { Contatos } from 'src/common/database/entities/contatos';
import { ContatosService } from 'src/contatos/service/contatos/contatos.service';

@Controller('contatos')
export class ContatosController {
    private readonly logger = new Logger(ContatosController.name);
    constructor(private readonly contatosService: ContatosService) {}

    @Get()
    findAll(): Promise<Contatos[]> {
        return this.contatosService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<Contatos> {
        return this.contatosService.findOne(+id);
    }

    @Post()
    async create(@Body() contatos: Contatos): Promise<Contatos> {
        try {
            await this.contatosService.create(contatos);
            return contatos;
        } catch (error) {
            this.logger.error('Falha em criar contato', error.stack);
            throw error;
        }
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<string> {
        try {
            await this.contatosService.remove(+id);
            return "Contato removido com sucesso"
        } catch (error) {
            this.logger.error('Falha em deletar contato', error.stack);
            throw error;
        }
    }
}