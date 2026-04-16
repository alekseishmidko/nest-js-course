import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/message.dto';
import { Logger } from '@nestjs/common';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(private readonly chatService: ChatService) {}

  async handleConnection(client: Socket) {
    this.logger.log(`Клиент подключился: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Клиент отключился: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() dto: SendMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const message = await this.chatService.create(dto);

    this.server.emit('messages', message);

    return message;
  }

  @SubscribeMessage('getMessages')
  async handleGetMessages(@ConnectedSocket() client: Socket) {
    const messages = await this.chatService.getMessages();

    client.emit('messages', messages);

    return messages;
  }
}
