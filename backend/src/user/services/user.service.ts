import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/common/database/entities/user';
import { Repository } from 'typeorm';
// import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async findByEmail(userEmail: string): Promise<User> {
        return await this.userRepository.findOne({
            where: { email: userEmail }
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

    create(user: User): Promise<User> {
        return this.userRepository.save(user);
    }

    async remove(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }
}
