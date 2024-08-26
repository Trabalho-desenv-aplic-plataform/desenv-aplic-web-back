import { Injectable } from '@nestjs/common';
import { User } from 'src/common/database/entities/user';
import { UserService } from 'src/user/services/user.service';
import { compareSync } from 'bcrypt';

@Injectable()
export class AuthService {
    
    constructor(private readonly userService: UserService) {}

    async validateUser(email: string, senha: string) {
        let user: User;

        try {
            user = await this.userService.findOneOrFail({ where: { email }})
        }
        catch (error) {
            return null;
        }

        const isPasswordValid = compareSync(senha, user.senha);

        if (!isPasswordValid) {
            return null;
        }
        return null;
    }
}
