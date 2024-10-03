import { Body, Controller, Delete, Get, Logger, Param, Post, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Contatos } from 'src/common/database/entities/contatos';
import { ContatosService } from 'src/contatos/service/contatos/contatos.service';
import { ApiConsumes, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';

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
            return 'Contato removido com sucesso';
        } catch (error) {
            this.logger.error('Falha em deletar contato', error.stack);
            throw error;
        }
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads', // Diretório onde os arquivos serão salvos
            filename: (req, file, cb) => {
                // Gera um nome de arquivo único
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = path.extname(file.originalname);
                cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            // Filtra apenas arquivos CSV
            if (path.extname(file.originalname).toLowerCase() !== '.csv') {
                return cb(new BadRequestException('Apenas arquivos CSV são permitidos!'), false);
            }
            cb(null, true);
        },
        limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB
    }))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @ApiOperation({ summary: 'Faz o upload de um arquivo CSV contendo contatos' })
    @ApiResponse({ status: 201, description: 'Arquivo CSV processado com sucesso!' })
    @ApiResponse({ status: 400, description: 'Erro no processamento do arquivo CSV.' })
    async uploadCsv(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('Nenhum arquivo foi enviado.');
        }

        try {
            // Chama o serviço para processar o CSV
            await this.contatosService.processCsv(file.path);

            // Remover o arquivo após o processamento
            fs.unlink(file.path, (err) => {
                if (err) {
                    this.logger.error('Erro ao remover o arquivo:', err);
                }
            });

            return { message: 'Arquivo CSV processado com sucesso!' };
        } catch (error) {
            // Remover o arquivo em caso de erro
            fs.unlink(file.path, () => {});
            throw new BadRequestException(`Erro ao processar o CSV: ${error.message}`);
        }
    }
}
