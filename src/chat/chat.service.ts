import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArrayContains, In, Repository } from 'typeorm';
import { Chat } from './chat.entity';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Chat) private chatRepository: Repository<Chat>,
      ) {}
      async createMessage(chat: Chat): Promise<Chat> {
        return await this.chatRepository.save(chat);
      }
    
      async getMessages(idUsers: any[], data:any): Promise<Chat[]> {
        let messages=  await this.chatRepository.find({where:{idUsers: ArrayContains(idUsers)},order:{createdAt:'ASC'}});
        if(messages.length==0){
          const newMessage = new Chat();
          newMessage.email=data.send;
          newMessage.emailsen= data.received;
          newMessage.text='Inicio una conversación';
          newMessage.idUsers=idUsers;
          newMessage.createdAt = new Date();
          
          await this.createMessage(newMessage);
        }
        messages=  await this.chatRepository.find({where:{idUsers: ArrayContains(idUsers)},order:{createdAt:'ASC'}});
        return messages;
      }

      async getPersons(email:string): Promise<Chat[]> {
        console.log(`select * from chat where "idUsers" in (
          SELECT "idUsers" FROM chat WHERE id IN (SELECT MAX(id) FROM chat where email = '${email}' or emailsen = '${email}' GROUP BY "idUsers")
          ) and id IN (SELECT MAX(id) FROM chat where (email != '${email}') or (emailsen notnull and email='${email}') GROUP BY "idUsers") order by "createdAt" DESC`);
        const rawData = await this.chatRepository.manager.query(`select * from chat where "idUsers" in (
          SELECT "idUsers" FROM chat WHERE id IN (SELECT MAX(id) FROM chat where email = '${email}' or emailsen = '${email}' GROUP BY "idUsers")
          ) and id IN (SELECT MAX(id) FROM chat where (email != '${email}') or (emailsen notnull and email='${email}') GROUP BY "idUsers") order by "createdAt" DESC`)
          console.log("--------------------------------");
          console.log(rawData);
          console.log("--------------------------------");
        return rawData;
      }
}
