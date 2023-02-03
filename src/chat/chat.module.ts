import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './chat.entity';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';

@Module({
 imports: [
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    username: 'joel',
    password: 'example',
    database: 'chat_db',
    entities: [Chat],
    synchronize: true,
    port:5432
  }),
  TypeOrmModule.forFeature([Chat]),

],
controllers: [ChatController],
  providers: [ChatGateway, ChatService]
})
export class ChatModule {}
