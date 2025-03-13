import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/common/database/entities/user';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';


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
}
