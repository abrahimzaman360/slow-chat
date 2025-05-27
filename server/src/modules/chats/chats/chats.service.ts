import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Chat } from '@/schema/chat.entity';
import { User } from '@/schema/user.entity';
import { CreateChatDto } from '../dto/create-chat.dto';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createChat(dto: CreateChatDto): Promise<Chat> {
    const participants = await this.userRepository.find({
      where: { id: In(dto.participantIds) },
    });

    const admins = dto.adminIds?.length
      ? await this.userRepository.find({ where: { id: In(dto.adminIds) } })
      : [];

    const newChat = this.chatRepository.create({
      name: dto.name,
      isGroup: dto.isGroup,
      participants,
      admins,
    });

    return this.chatRepository.save(newChat);
  }

  async getUserChats(userId: string): Promise<Chat[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['chats', 'chats.participants', 'chats.admins', 'chats.messages'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.chats;
  }

  async findOrCreateOneOnOneChat(participantIds: string[]): Promise<Chat> {
    if (participantIds.length !== 2) {
      throw new Error('One-on-one chat must have exactly 2 participants.');
    }

    const participants = await this.userRepository.find({
      where: { id: In(participantIds) },
    });

    const existingChats = await this.chatRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.participants', 'participant')
      .where('chat.isGroup = :isGroup', { isGroup: false })
      .getMany();

    const existingChat = existingChats.find(chat => {
      const ids = chat.participants.map(p => p.id).sort();
      return (
        ids.length === 2 &&
        ids.includes(participantIds[0]) &&
        ids.includes(participantIds[1])
      );
    });

    if (existingChat) return existingChat;

    const newChat = this.chatRepository.create({
      isGroup: false,
      participants,
    });

    return this.chatRepository.save(newChat);
  }
}
