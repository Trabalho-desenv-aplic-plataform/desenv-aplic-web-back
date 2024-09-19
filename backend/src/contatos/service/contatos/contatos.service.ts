import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contatos } from 'src/common/database/entities/contatos';
import { Repository } from 'typeorm';

@Injectable()
export class ContatosService {
    constructor(
        @InjectRepository(Contatos)
        private readonly userRepository: Repository<Contatos>
    ) {}

    findAll(): Promise<Contatos[]> {
        return this.userRepository.find();
    }

    findOne(id: number): Promise<Contatos> {
        return this.userRepository.findOneBy({ id });
    }

    create(contatos: Contatos): Promise<Contatos> {
        return this.userRepository.save(contatos);
    }

    async remove(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }
    
}
