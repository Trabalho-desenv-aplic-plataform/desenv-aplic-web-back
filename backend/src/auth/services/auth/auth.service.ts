import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/services/user.service';
import * as bcrypt from 'bcrypt';
import { hash } from 'crypto';


@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService
    ) {}

    async validateUser(email: string, senha: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
    
        if (!user) {
            throw new UnauthorizedException('Email inválido');
        }
    
        console.log("Senha fornecida:", senha);
        console.log("Senha armazenada (hash):", user.senha);
    
        // Comparação correta da senha com a hash
        const senhaValida = await bcrypt.compare(senha, user.senha);
    
        if (!senhaValida) {
            throw new UnauthorizedException('Credenciais inválidas');
        }
    
        const payload = { email: user.email, sub: user.id };
        return { access_token: this.jwtService.sign(payload) };
    }
    
}