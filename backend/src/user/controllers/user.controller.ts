import { Body, Controller, Delete, Get, Logger, Param, Post, UseGuards, Req, BadRequestException, NotFoundException } from '@nestjs/common';
import { User } from 'src/common/database/entities/user';
import { UserService } from '../services/user.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import * as bcrypt from 'bcrypt'
@Controller('user')
export class UserController {
    private readonly logger = new Logger(UserController.name);

    constructor(private readonly userService: UserService) {}

    /**
     * Retorna o perfil do usuário autenticado
     */
    @Get('perfil')
    @UseGuards(JwtAuthGuard)
    getProfile(@Req() req) {
        return req.user; // Retorna os dados do usuário autenticado
    } 

    /**
     * Lista todos os usuários (sem senha)
     */
    @Get()
    async findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    /**
     * Busca um usuário pelo ID
     */
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<User> {
        const userId = parseInt(id, 10);
        if (isNaN(userId)) {
            throw new BadRequestException('ID inválido');
        }

        const user = await this.userService.findOne(userId);
        if (!user) {
            throw new NotFoundException('Usuário não encontrado');
        }

        return user;
    }

    /**
     * Cadastro de usuário com documentação no Swagger
     */
    
    @Post('cadastrar')
    @ApiOperation({ summary: 'Criar um novo usuário' })
    @ApiResponse({ status: 201, description: 'Usuário criado com sucesso.', type: User })
    @ApiResponse({ status: 400, description: 'Dados inválidos.' })
    @ApiBody({
        schema: {
          type: 'object',
          properties: {
            nome: { type: 'string', example: 'João Silva' },
            email: { type: 'string', example: 'joao@email.com' },
            senha: { type: 'string', example: 'senha123' },
            tipo: { type: 'string', example: 'admin' }
          },
        },
    })
    async create(@Body() dados: { nome: string; email: string; senha: string; tipo?: string }): Promise<User> {
        try {
            // Hash da senha
            const senhaHash = await bcrypt.hash(dados.senha, 10);
            console.log("Senha gerada para o banco:", senhaHash); // Debug
    
            // Criar usuário garantindo compatibilidade com a entidade User
            const novoUsuario = Object.assign(new User(), {
                nome: dados.nome,
                email: dados.email,
                senha: senhaHash, 
                tipo: dados.tipo ?? 'user' // Define um valor padrão se não for passado
            });
    
            return await this.userService.create(novoUsuario);
        } catch (error) {
            this.logger.error(`Erro ao criar usuário: ${error.message}`, error.stack);
            throw new BadRequestException('Erro ao criar usuário');
        }
    }
    


    /**
     * Remove um usuário pelo ID
     */
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<string> {
        const userId = parseInt(id, 10);
        if (isNaN(userId)) {
            throw new BadRequestException('ID inválido');
        }

        try {
            await this.userService.remove(userId);
            return "Usuário removido com sucesso";
        } catch (error) {
            this.logger.error('Erro ao remover usuário', error.stack);
            throw new BadRequestException('Erro ao remover usuário');
        }
    }
}
