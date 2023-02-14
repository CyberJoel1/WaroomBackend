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
    host: 'containers-us-west-152.railway.app',
    username: 'postgres',
    password: 'glRtqQASnYzZPXeBqCgZ',
    database: 'railway',
    entities: [Chat],
    synchronize: true,
    port:6981
  }),
  TypeOrmModule.forFeature([Chat]),

],
controllers: [ChatController],
  providers: [ChatGateway, ChatService]
})
export class ChatModule {}
