import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Chat, ChatDocument } from '../schema/chat.schema';
import { CreateChatDto } from '../dto/create-chat.dto';

@Injectable()
export class ChatsService {
  constructor(@InjectModel(Chat.name) private chatModel: Model<ChatDocument>) {}

  async createChat(dto: CreateChatDto): Promise<Chat> {
    const newChat = new this.chatModel({
      name: dto.name,
      isGroup: dto.isGroup,
      participants: dto.participantIds.map((id) => new Types.ObjectId(id)),
      admins: dto.adminIds?.map((id) => new Types.ObjectId(id)) || [],
      createdBy: dto.createdBy ? new Types.ObjectId(dto.createdBy) : null,
    });

    return newChat.save();
  }

  async getUserChats(userId: string): Promise<Chat[]> {
    return this.chatModel
      .find({ participants: new Types.ObjectId(userId) })
      .populate('participants', 'username')
      .populate('lastMessage')
      .exec();
  }

  async findOrCreateOneOnOneChat(
    participantIds: string[],
  ): Promise<ChatDocument> {
    // participantIds should be exactly 2 user IDs
    const objectIds = participantIds.map(id => new Types.ObjectId(id));

    // Try to find existing chat with these 2 participants (order insensitive)
    let chat = await this.chatModel.findOne({
      isGroup: false,
      participants: { $all: objectIds, $size: 2 },
    });

    if (chat) return chat;

    // Else, create new chat
    chat = new this.chatModel({
      isGroup: false,
      participants: objectIds,
    });

    return chat.save();
  }
}
