import { Controller, Post, Param, Body, BadRequestException } from '@nestjs/common';
import { BotService } from './bot.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('bot')
@Controller('bot')
export class BotController {
  constructor(private readonly botService: BotService) {}

  /**
   * Endpoint para enviar uma mensagem para todos os contatos de um grupo específico.
   * @param grupoId - ID do grupo
   * @param message - Mensagem a ser enviada
   */
  @Post('send-message/:grupoId')
  @ApiOperation({ summary: 'Enviar mensagem para todos os contatos de um grupo' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
        },
      },
      required: ['message'],
    },
  })
  @ApiResponse({ status: 200, description: 'Mensagens enviadas com sucesso!' })
  @ApiResponse({ status: 400, description: 'Erro no envio das mensagens.' })
  async sendMessageToGroup(
    @Param('grupoId') grupoId: number,
    @Body('message') message: string,
  ) {
    if (!message) {
      throw new BadRequestException('A mensagem é obrigatória.');
    }

    await this.botService.sendMessageToGroup(grupoId, message);
    return { message: 'Mensagens enviadas com sucesso!' };
  }
}
