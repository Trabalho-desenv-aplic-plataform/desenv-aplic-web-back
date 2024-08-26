import { BadRequestException, ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/common/database/entities/user';
import { FindOptions, Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
// import { User } from './user.entity';

@Injectable()
export class UserService {
    // private readonly logger = new Logger(UserController.name);
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async findAll(): Promise<User[]> {
        return this.userRepository.find({
            select: ['nome', 'email', 'tipo'] // Campos que serão retornados no getAll
        });
    }

    async findOne(id: number): Promise<User> {
        return this.userRepository.findOneBy({ id });
    }

    // async findOneOrFail(conditions: FindConditions<User>) {

    // }

    async create(data: CreateUserDto): Promise<User> {
        try {
            const user = this.userRepository.create(data); // Cria uma nova instância da entidade user
            if (!user.tipo) {
                user.tipo = "Funcionário";
            }
            return await this.userRepository.save(user); // Persiste os dados no banco
        }
        catch (error) {
            if (error.code === '23505') {
                throw new ConflictException("Email já cadastrado", error.message)
            }
            throw error;
        }
    }

    async update(id: number, data: User): Promise<User> {
        const user = await this.findOne(id); // Atribui o usuário a variável através do id
        this.userRepository.merge(user, data); // Mescla os valores passados em data, no usuário retornado 
        return await this.userRepository.save(user); // Persiste as alterações no banco após o merge
    }

    async remove(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }
}
