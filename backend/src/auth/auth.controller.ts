import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/auth')
export class AuthController {
    @UseGuards(AuthGuard('local')) // passport
    @Post('login')
    async login(@Req() req: any) {
        return { success: true, message: "Usuário logado com sucesso !"};
    }
}
