import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

import { Chat } from './chat.entity';
import { ChatService } from './chat.service';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway
 implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private chatService: ChatService
    ) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('events')
  async handleSendMessage(client: Socket, payload: any): Promise<void> {
    await this.chatService.createMessage(payload.data);
    console.log(client);
    console.log(payload)
    this.server.emit(payload.idSend, payload);
  }

  afterInit(server: Server) {
    console.log(server);
    //Do stuffs
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
    //Do stuffs
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Connected ${client.id}`);
    //Do stuffs
  }
}
