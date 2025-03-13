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
            select: ['id', 'nome', 'email', 'senha'], // Garante que a senha é retornada
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
        // Verifica se o usuário já existe
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
      
        // Gerar um token aleatório
        const token = crypto.randomBytes(32).toString('hex');
        const expirationTime = new Date();
        expirationTime.setHours(expirationTime.getHours() + 1); // Expira em 1 hora
      
        // Salvar o token e a data de expiração no banco
        user.resetToken = token;
        user.resetTokenExpires = expirationTime;
      
        await this.userRepository.save(user);
      
        // Enviar e-mail ou resposta com o token
        return { message: 'E-mail de recuperação enviado', token };
    }

    async redefinirSenha(token: string, novaSenha: string) {
        const user = await this.userRepository.findOne({ where: { resetToken: token } });
      
        if (!user || user.resetTokenExpires < new Date()) {
          throw new BadRequestException('Token inválido ou expirado');
        }
      
        // Hash da nova senha
        user.senha = await bcrypt.hash(novaSenha, 10);
      
        // Remover o token após redefinição
        user.resetToken = null;
        user.resetTokenExpires = null;
      
        await this.userRepository.save(user);
      
        return { message: 'Senha redefinida com sucesso' };
    }
}
