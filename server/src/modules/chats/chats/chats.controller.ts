import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateChatDto } from '../dto/create-chat.dto';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post()
  createChat(@Body() dto: CreateChatDto) {
    return this.chatsService.createChat(dto);
  }

  @Get(':userId')
  getUserChats(@Param('userId') userId: string) {
    return this.chatsService.getUserChats(userId);
  }

  @Post('p2p')
  async createOneOnOneChat(@Body() createChatDto: CreateChatDto) {
    const chat = await this.chatsService.findOrCreateOneOnOneChat(
      createChatDto.participantIds,
    );
    return chat;
  }
}
