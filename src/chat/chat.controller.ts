import { Controller, Render, Get, Res, Req, Body } from '@nestjs/common';
import { Post } from '@nestjs/common/decorators';

import { Chat } from './chat.entity';
import { ChatService } from './chat.service';

@Controller()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('/chat')
  @Render('index')
  Home() {
    return { message: 'Hello world!' };
  }

  @Post('/api/chat')
  async Chat(@Body() data:any,@Res() res) {
    console.log("[api][chat]")
    console.log("-----------------------------------");
    console.log(data);
    console.log("-----------------------------------");
    const messages = await this.chatService.getMessages([parseInt(data.idUsers[0]),parseInt(data.idUsers[1])],data);
    res.json(messages);
  }

  @Post('/api/chats')
  async ChatPersons(@Body() data:any,@Res() res) {
    console.log("-----------------------------------");
    console.log(data);
    console.log("-----------------------------------");
    const messages = await this.chatService.getPersons(data.email);
    res.json(messages);
  }
}

