import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api'; 
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contatos } from 'src/common/database/entities/contatos';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class BotService {
  private readonly logger = new Logger(BotService.name);
  private bot: TelegramBot;

  constructor(
    private configService: ConfigService,
    @InjectRepository(Contatos)
    private readonly contatosRepository: Repository<Contatos>,
  ) {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    if (!token) {
      this.logger.error('Token do bot do Telegram não foi fornecido!');
      throw new Error('Token do bot do Telegram não foi fornecido!');
    }

    this.bot = new TelegramBot(token, { polling: true });

    
    this.bot.on('message', async (msg) => {
      const chatId = msg.chat.id.toString();
      const text = msg.text?.toLowerCase();

      this.logger.log(`Mensagem recebida de ${chatId}: ${text}`);

      if (text === 'register') {
        await this.bot.sendMessage(chatId, 'Por favor, envie seu número de telefone para registrar.');

        
        this.bot.once('message', async (msg) => {
          const phoneNumber = msg.text?.trim();

          if (phoneNumber) {
            
            const contato = await this.contatosRepository.findOneBy({ numero: phoneNumber });

            if (contato) {
              contato.chatId = chatId;
              await this.contatosRepository.save(contato);
              await this.bot.sendMessage(chatId, 'Seu chatId foi registrado com sucesso!');
              this.logger.log(`ChatId ${chatId} registrado para contato ID ${contato.id}`);
            } else {
              await this.bot.sendMessage(chatId, 'Nenhum contato encontrado com esse número de telefone.');
              this.logger.warn(`Nenhum contato encontrado com o número de telefone: ${phoneNumber}`);
            }
          } else {
            await this.bot.sendMessage(chatId, 'Número de telefone inválido.');
            this.logger.warn(`Número de telefone inválido enviado por chatId: ${chatId}`);
          }
        });
      }
    });
  }

  /**
   
   * @param chatId 
   * @param message 
   */
  async sendMessage(chatId: string, message: string): Promise<void> {
    try {
      await this.bot.sendMessage(chatId, message);
      this.logger.log(`Mensagem enviada para chatId ${chatId}`);
    } catch (error) {
      this.logger.error(`Erro ao enviar mensagem para chatId ${chatId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Envia uma mensagem para todos os contatos de um grupo específico.
   * @param grupoId 
   * @param message 
   */
  async sendMessageToGroup(grupoId: number, message: string): Promise<void> {
    const contatos = await this.contatosRepository.find({ where: { grupoId } });

    if (contatos.length === 0) {
      throw new BadRequestException('Nenhum contato encontrado para o grupo especificado.');
    }

    const batchSize = 20; 
    const delayBetweenBatches = 1000; 

    for (let i = 0; i < contatos.length; i += batchSize) {
      const batch = contatos.slice(i, i + batchSize);

      await Promise.all(
        batch.map(async (contato) => {
          if (contato.chatId) {
            try {
              const personalizedMessage = `Olá ${contato.nome},\n\n${message}`;
              await this.sendMessage(contato.chatId, personalizedMessage);
            } catch (error) {
              this.logger.error(`Erro ao enviar mensagem para ${contato.nome} (${contato.chatId}): ${error.message}`);
            }
          } else {
            this.logger.warn(`Contato ${contato.nome} não possui chatId registrado.`);
          }
        }),
      );

      
      await new Promise((resolve) => setTimeout(resolve, delayBetweenBatches));
    }
  }

  /**
   * Método para registrar o chatId de um contato.
   * @param contatoId - ID do contato
   * @param chatId - ID do chat no Telegram
   */
  async registerChatId(contatoId: number, chatId: string): Promise<void> {
    const contato = await this.contatosRepository.findOneBy({ id: contatoId });
    if (contato) {
      contato.chatId = chatId;
      await this.contatosRepository.save(contato);
      this.logger.log(`ChatId ${chatId} registrado para contato ID ${contatoId}`);
    } else {
      this.logger.warn(`Contato com ID ${contatoId} não encontrado.`);
    }
  }
}
