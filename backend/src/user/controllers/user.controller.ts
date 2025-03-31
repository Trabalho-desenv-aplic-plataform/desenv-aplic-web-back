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
        return req.user; 
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

            const senhaHash = await bcrypt.hash(dados.senha, 10);
            console.log("Senha gerada para o banco:", senhaHash); 
    
            
            const novoUsuario = Object.assign(new User(), {
                nome: dados.nome,
                email: dados.email,
                senha: senhaHash, 
                tipo: dados.tipo ?? 'user' 
            });
    
            return await this.userService.create(novoUsuario);
        } catch (error) {
            this.logger.error(`Erro ao criar usuário: ${error.message}`, error.stack);
            throw new BadRequestException('Erro ao criar usuário');
        }
    }
    
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

    @Post('esqueci-senha')
    @ApiOperation({ summary: 'Solicitar recuperação de senha' })
    @ApiBody({
        schema: {
        type: 'object',
        properties: {
            email: { type: 'string', example: 'usuario@email.com' },
        },
        },
    })
    @ApiResponse({ status: 200, description: 'E-mail enviado com sucesso' })
    @ApiResponse({ status: 400, description: 'Usuário não encontrado' })
    async solicitarRecuperacao(@Body('email') email: string) {
        return this.userService.solicitarRecuperacaoSenha(email);
    }

    @Post('redefinir-senha')
    @ApiOperation({ summary: 'Redefinir senha usando um token' })
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          token: { type: 'string', example: '1234567890abcdef' },
          novaSenha: { type: 'string', example: 'NovaSenha@123' },
        },
      },
    })
    @ApiResponse({ status: 200, description: 'Senha redefinida com sucesso' })
    @ApiResponse({ status: 400, description: 'Token inválido ou expirado' })
    async redefinirSenha(
      @Body('token') token: string,
      @Body('novaSenha') novaSenha: string
    ) {
      return this.userService.redefinirSenha(token, novaSenha);
    }
}
