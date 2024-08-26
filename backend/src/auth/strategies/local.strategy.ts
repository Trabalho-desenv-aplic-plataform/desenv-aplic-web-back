import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { MessageEnum } from "src/helpers/message.enum";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authService: AuthService
    ) {
        super({
            usernameField: 'email'
        }) // Vai sobrescrever no construtor para utilizar email ao invés do username que é o padrão
    }

    async validate(email: string, senha: string) {
        const user = this.authService.validateUser(email, senha);

        if (!user) {
            throw new UnauthorizedException(MessageEnum.SENHA_EMAIL_INVALIDOS);
        }
        return user;
    }
}