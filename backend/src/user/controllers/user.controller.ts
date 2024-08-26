import { Body, Controller, Delete, Get, Logger, Param, Post } from '@nestjs/common';
import { User } from 'src/common/database/entities/user';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';

@Controller('user')
export class UserController {
    private readonly logger = new Logger(UserController.name);
    constructor(private readonly userService: UserService) {}

    @Get()
    findAll(): Promise<User[]> {
        try {
            return this.userService.findAll();
        }
        catch (error) {
            this.logger.error("problemas em carregar os usuários", error);
        }
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<User> {
        return this.userService.findOne(+id);
    }

    @Post()
    async create(@Body() data: CreateUserDto): Promise<User> {
        return this.userService.create(data);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<any> {
        try {
            await this.userService.remove(+id);
            return {
                message: "Usuário removido com sucesso"
            }
        }
        catch (error) {
            this.logger.error(`Falha em deletar usuário`, error.stack);
            throw error;
        }
    }
}
