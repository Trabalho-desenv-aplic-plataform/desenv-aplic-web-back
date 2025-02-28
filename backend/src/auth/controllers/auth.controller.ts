import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from '../services/auth/auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'usuario@email.com' },
                senha: { type: 'string', example: '123456' },
            },
        },
    })
    async login(@Body() body: { email: string, senha: string }) {
        return this.authService.validateUser(body.email, body.senha);
    }
}
