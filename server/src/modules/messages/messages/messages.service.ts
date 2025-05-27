import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message, MessageDocument } from '../schema/message.schema';
import { CreateMessageDto } from '../dto/create-message.dto';
import { Chat, ChatDocument } from '../../chats/schema/chat.schema';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>, // works now 🎉
  ) {
    console.log('MessagesService initialized...');
  }

  async sendMessage(dto: CreateMessageDto): Promise<Message> {
    const chat = await this.chatModel.findById(dto.chatId);
    if (!chat) throw new NotFoundException('Chat not found');

    const message = new this.messageModel({
      chat: new Types.ObjectId(dto.chatId),
      sender: new Types.ObjectId(dto.senderId),
      content: dto.content,
      type: dto.type,
    });

    const savedMessage = await message.save();

    // Update chat's last message
    await this.chatModel.findByIdAndUpdate(dto.chatId, {
      lastMessage: savedMessage._id,
    });

    return savedMessage;
  }

  async getMessages(chatId: string): Promise<Message[]> {
    return this.messageModel
      .find({ chat: new Types.ObjectId(chatId) })
      .populate('sender', 'username')
      .sort({ createdAt: 1 }) // oldest to newest
      .exec();
  }

  async createMessage(payload: {
    chatId: string;
    senderId: string;
    content: string;
    type?: string;
  }): Promise<MessageDocument> {
    const message = new this.messageModel({
      chat: payload.chatId,
      sender: payload.senderId,
      content: payload.content,
      type: payload.type || 'text',
      readBy: [payload.senderId], // sender has read their own message
    });

    return message.save();
  }

  async getChatParticipants(chatId: string): Promise<Types.ObjectId[]> {
    const chat = await this.chatModel.findById(chatId);
    if (!chat) throw new NotFoundException('Chat not found');
    return chat.participants;
  }
}
