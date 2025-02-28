import { Injectable } from '@nestjs/common';
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
        return this.userRepository.findOne({ where: { email } });
    }

    findAll(): Promise<User[]> {
        return this.userRepository.find({
            select: ['nome', 'email', 'tipo']
        });
    }

    findOne(id: number): Promise<User> {
        return this.userRepository.findOneBy({ id });
    }

    create(user: User): Promise<User> {
        return this.userRepository.save(user);
    }

    async createUser(nome: string, email: string, senha: string): Promise<User> {
        const salt = await bcrypt.genSalt(10);
        const senhaCriptografada = await bcrypt.hash(senha, salt);
        
        const newUser = this.userRepository.create({ nome, email, senha: senhaCriptografada });
        return this.userRepository.save(newUser);
    }
    
    async cadastrar(dados: { nome: string; email: string; senha: string }): Promise<User> {
        const usuarioExiste = await this.userRepository.findOne({ where: { email: dados.email } });
    
        if (usuarioExiste) {
          throw new Error('Email já cadastrado!');
        }
    
        const salt = await bcrypt.genSalt(10);
        const senhaCriptografada = await bcrypt.hash(dados.senha, salt);
    
        const novoUsuario = this.userRepository.create({
          nome: dados.nome,
          email: dados.email,
          senha: senhaCriptografada,
        });
    
        return await this.userRepository.save(novoUsuario);
      }
    async remove(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }
}
