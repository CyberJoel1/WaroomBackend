import { Injectable } from '@nestjs/common';
import { CreateLikeInput } from './dto/create-like.input';
import { UpdateLikeInput } from './dto/update-like.input';
import { LikeRepository } from './like.repository';

@Injectable()
export class LikeService {

  constructor(private readonly likeRepository: LikeRepository) {}

  async create(idUser:number,createLikeInput: CreateLikeInput): Promise<boolean> {
    const checkLike=await this.likeRepository.checkLikePublication(idUser,createLikeInput);
    if(!checkLike){
      return await this.likeRepository.createLikePublication(idUser,createLikeInput);
    }
      return false; 
  }

  async countAll(createLikeInput: CreateLikeInput): Promise<number> {
    return await this.likeRepository.countLikePublication(createLikeInput);
  }

  async checkLike(idUser:number,createLikeInput: CreateLikeInput): Promise<boolean> {
    return await this.likeRepository.checkLikePublication(idUser, createLikeInput);
  }


  async remove(idUser:number,createLikeInput: CreateLikeInput): Promise<boolean> {
    return await this.likeRepository.deleteLikePublication(idUser, createLikeInput);
  }
}
