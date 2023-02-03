import { Injectable } from '@nestjs/common';
import { Chat } from 'src/chat/entities/chat.entities';
import { User } from '../entities/user.entity';
import { CreateFriendlyInput } from './dto/create-friendly.input';
import { UpdateFriendlyInput } from './dto/update-friendly.input';
import { FriendlyRepository } from './friendly.repository';

@Injectable()
export class FriendlyService {
  constructor(private readonly friendlyRepository: FriendlyRepository) {}

  async confirmChatListen(id: number,idRelation:number): Promise<boolean> {
    return this.friendlyRepository.confirmChatListen(id,idRelation);
  }

  async create(
    userSend: number,
    createFriendlyInput: CreateFriendlyInput,
  ): Promise<boolean> {
    const confirmFriend = await this.friendlyRepository.confirmFriendly(
      userSend,
      createFriendlyInput.userReceived,
    );
    console.log(confirmFriend);
    if (confirmFriend !== 'no hay amistad') {
      return false;
    }
    return await this.friendlyRepository.createFriendly(
      userSend,
      createFriendlyInput,
    );
  }

  async findAll(userName: string) {
    return await this.friendlyRepository.findAllRequestForUserName(userName);
  }
  async findAllFriends(userName: string): Promise<User[]> {
    return await this.friendlyRepository.findAllFriends(userName);
  }

  async confirmRequestOne(id: number) {
    return await this.friendlyRepository.confirmRequestFriendly(id);
  }

  update(id: number, updateFriendlyInput: UpdateFriendlyInput) {
    return `This action updates a #${id} friendly`;
  }

  async confirmFriendly(user1: number, user2: string): Promise<string> {
    return await this.friendlyRepository.confirmFriendly(user1, user2);
  }

  async confirmChat(chat: Chat): Promise<any[]> {
    return await this.friendlyRepository.confirmChat(chat);
  }

  async remove(userSend: number, userReceived: string): Promise<boolean> {
    return await this.friendlyRepository.deleteFriendly(userSend, userReceived);
  }
}
