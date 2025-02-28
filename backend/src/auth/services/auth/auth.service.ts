import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/services/user.service';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService
    ) {}

    async validateUser(email: string, senha: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);

        if (!user || !user.senha) { // Verifica se o usuário existe e tem senha armazenada
            throw new UnauthorizedException('Credenciais inválidas');
        }

        console.log('Senha fornecida:', senha);
        console.log('Senha armazenada:', user.senha);

        const senhaValida = await bcrypt.compare(senha, user.senha);
        if (!senhaValida) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        const payload = { email: user.email, sub: user.id };
        return { access_token: this.jwtService.sign(payload) };
    }
}