import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/common/database/entities/user';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async findByEmail(email: string): Promise<User | undefined> {
        return this.userRepository.findOne({
            where: { email },
            select: ['id', 'nome', 'email', 'senha'],
        });
    }

    findAll(): Promise<User[]> {
        return this.userRepository.find({
            select: ['nome', 'email', 'tipo']
        });
    }

    findOne(id: number): Promise<User> {
        return this.userRepository.findOneBy({ id });
    }

    async create(user: User): Promise<User> {
        const usuarioExiste = await this.userRepository.findOne({ where: { email: user.email } });
    
        if (usuarioExiste) {
            throw new BadRequestException('Email já cadastrado!');
        }
    
        return this.userRepository.save(user);
    }

    async remove(id: number): Promise<void> {
        const user = await this.userRepository.findOne({ where: { id } });
    
        if (!user) {
            throw new NotFoundException('Usuário não encontrado');
        }
    
        await this.userRepository.delete(id);
    }

    async solicitarRecuperacaoSenha(email: string) {
        const user = await this.userRepository.findOne({ where: { email } });
      
        if (!user) {
          throw new NotFoundException('Usuário não encontrado');
        }
      
        const token = crypto.randomBytes(32).toString('hex');
        const expirationTime = new Date();
        expirationTime.setHours(expirationTime.getHours() + 1); // Expira em 1 hora
      
        user.USR_resetToken = token;
        user.USR_resetTokenExpires = expirationTime;
      
        await this.userRepository.save(user);
      
        return { message: 'Token de recuperação enviado', token };
    }

    async redefinirSenha(token: string, novaSenha: string) {
        const user = await this.userRepository.findOne({ where: { USR_resetToken: token } });
      
        if (!user || user.USR_resetTokenExpires < new Date()) {
          throw new BadRequestException('Token inválido ou expirado');
        }
      
        
        user.senha = await bcrypt.hash(novaSenha, 10);
      
        user.USR_resetToken = null;
        user.USR_resetTokenExpires = null;
      
        await this.userRepository.save(user);
      
        return { message: 'Senha redefinida com sucesso' };
    }
}
