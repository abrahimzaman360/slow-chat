import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageDto } from '../dto/create-message.dto';
import { Message, MessageType } from '@/schema/message.entity';
import { Chat } from '@/schema/chat.entity';
import { User } from '@/schema/user.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,

    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async sendMessage(dto: CreateMessageDto): Promise<Message> {
    const chat = await this.chatRepository.findOne({
      where: { id: dto.chatId },
    });
    if (!chat) throw new NotFoundException('Chat not found');

    const sender = await this.userRepository.findOne({
      where: { id: dto.senderId },
    });
    if (!sender) throw new NotFoundException('Sender not found');

    const message = this.messageRepository.create({
      chat,
      sender,
      content: dto.content,
      type: dto.type,
    });

    const savedMessage = await this.messageRepository.save(message);

    // (Optional) Update chat's last message if such a column exists
    // chat.lastMessage = savedMessage;
    // await this.chatRepository.save(chat);

    return savedMessage;
  }

  async getMessages(chatId: string): Promise<Message[]> {
    return this.messageRepository.find({
      where: { chat: { id: chatId } },
      relations: ['sender'],
      order: { createdAt: 'ASC' },
    });
  }

  async createMessage(payload: {
    chatId: string;
    senderId: string;
    content: string;
    type?: string;
  }): Promise<Message> {
    const chat = await this.chatRepository.findOne({
      where: { id: payload.chatId },
    });
    if (!chat) throw new NotFoundException('Chat not found');

    const sender = await this.userRepository.findOne({
      where: { id: payload.senderId },
    });
    if (!sender) throw new NotFoundException('Sender not found');

    // Validate or cast the type to MessageType enum
    const messageType = Object.values(MessageType).includes(
      payload.type as MessageType,
    )
      ? (payload.type as MessageType)
      : MessageType.TEXT;

    const message = this.messageRepository.create({
      chat, // ✅ full Chat entity
      sender, // ✅ full User entity
      content: payload.content,
      type: messageType, // ✅ casted to enum
    });

    return this.messageRepository.save(message);
  }

  async getChatParticipants(chatId: string): Promise<User[]> {
    const chat = await this.chatRepository.findOne({
      where: { id: chatId },
      relations: ['participants'],
    });
    if (!chat) throw new NotFoundException('Chat not found');
    return chat.participants;
  }
}
