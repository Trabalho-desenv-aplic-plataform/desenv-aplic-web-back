import { Body, Controller, Delete, Get, Logger, Param, Post, UseGuards, Req } from '@nestjs/common';
import { User } from 'src/common/database/entities/user';
import { UserService } from '../services/user.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('user')
export class UserController {
    private readonly logger = new Logger(UserController.name);
    constructor(private readonly userService: UserService) {}

    @Get('perfil')
    @UseGuards(JwtAuthGuard) // 🔒 Protege o endpoint com JWT
    getProfile(@Req() req) {
    return req.user; // Retorna os dados do usuário autenticado
    } 

    @Get()
    findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<User> {
        return this.userService.findOne(+id);
    }

    @Post()
    async create(@Body() user: User): Promise<User> {
        try {
            await this.userService.create(user);
            return user;
        } catch (error) {
            this.logger.error(`Falha em criar `, error.stack);
            throw error;
        }
    }

    @Post()
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
            tipo: { type: 'string', example: 'admin' },
          },
        },
      })
      async cadastrarUsuario(@Body() dados: { nome: string; email: string; senha: string }): Promise<User> {
        return this.userService.cadastrar(dados);
      }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<string> {
        try {
            await this.userService.remove(+id);
            return "Usuário removido com sucesso"
        }
        catch (error) {
            this.logger.error(`Falha em deletar usuário`, error.stack);
            throw error;
        }
    }
}
