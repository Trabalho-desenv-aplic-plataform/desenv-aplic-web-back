import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/services/user.service';
import bcrypt from "bcrypt";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService
    ) {}

    async signIn(userEmail: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(userEmail);
        // Comparação da senha passada por parâmetro com a senha hash
        // const isPasswordValid = await bcrypt.compare(pass, user.senha);

        if (!user || user?.senha !== pass) {
            throw new UnauthorizedException("Credenciais inválidas");
        }        

        const payload = { sub: user.id, username: user.email };
        return {
            access_token: await this.jwtService.signAsync(payload)
        }
    }
}
