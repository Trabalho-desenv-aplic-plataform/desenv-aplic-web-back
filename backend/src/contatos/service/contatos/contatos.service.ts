import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contatos } from 'src/common/database/entities/contatos';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as csv from 'csv-parser';

@Injectable()
export class ContatosService {
    constructor(
        @InjectRepository(Contatos)
        private readonly contatosRepository: Repository<Contatos>
    ) {}

    findAll(): Promise<Contatos[]> {
        return this.contatosRepository.find();
    }

    findOne(id: number): Promise<Contatos> {
        return this.contatosRepository.findOneBy({ id });
    }

    create(contato: Contatos): Promise<Contatos> {
        return this.contatosRepository.save(contato);
    }

    async remove(id: number): Promise<void> {
        await this.contatosRepository.delete(id);
    }

    async processCsv(filePath: string): Promise<void> {
      const contatos: Contatos[] = [];
  
      return new Promise((resolve, reject) => {
          fs.createReadStream(filePath)
              .pipe(csv())
              .on('data', (row) => {
                  try {
                      const contato = new Contatos(); // Certifique-se de usar "new Contatos()"
                      // Mapeamento dos campos do CSV para as colunas da entidade
                      contato.nome = row.nome.trim(); // Coluna 'nome' no CSV
                      contato.numero = row.telefone.trim(); // Coluna 'telefone' no CSV
                      contato.grupoId = parseInt(row.grupoId.trim()); // Coluna 'grupoId' no CSV
  
                      // Definir o status baseado em alguma lógica ou padrão
                      contato.status = true;
  
                      contatos.push(contato);
                  } catch (error) {
                      // Lidar com erros de mapeamento individual se necessário
                      console.error('Erro ao mapear linha do CSV:', error);
                  }
              })
              .on('end', async () => {
                  try {
                      if (contatos.length === 0) {
                          throw new BadRequestException('Nenhum contato válido encontrado no CSV.');
                      }
                      await this.contatosRepository.save(contatos);
                      resolve();
                  } catch (error) {
                      reject(error);
                  }
              })
              .on('error', (error) => {
                  reject(error);
              });
      });
  }
}
