import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Grupos } from 'src/common/database/entities/grupos';
import { Repository } from 'typeorm';

@Injectable()
export class GruposService {
    constructor(
        @InjectRepository(Grupos)
        private readonly gruposRepository : Repository<Grupos>
    ){}

    findAll(): Promise<Grupos[]> {
        return this.gruposRepository.find();
    }

    findOne(id: number): Promise<Grupos> {
        return this.gruposRepository.findOneBy({id})
    }

    create(grupos: Grupos): Promise<Grupos> {
        return this.gruposRepository.save(grupos);
    }

    async remove(id: number): Promise<void> {
        await this.gruposRepository.delete(id);
    }
}
