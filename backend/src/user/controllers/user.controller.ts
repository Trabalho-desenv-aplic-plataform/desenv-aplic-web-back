import { Body, Controller, Delete, Get, Logger, Param, Post } from '@nestjs/common';
import { User } from 'src/common/database/entities/user';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
    private readonly logger = new Logger(UserController.name);
    constructor(private readonly userService: UserService) {}

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
            this.logger.error(`Falha em criar usuário`, error.stack);
            throw error;
        }
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
