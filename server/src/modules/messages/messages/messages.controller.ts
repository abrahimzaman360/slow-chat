import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from '../dto/create-message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  sendMessage(@Body() dto: CreateMessageDto) {
    return this.messagesService.sendMessage(dto);
  }

  @Get(':chatId')
  getMessages(@Param('chatId') chatId: string) {
    return this.messagesService.getMessages(chatId);
  }
}
