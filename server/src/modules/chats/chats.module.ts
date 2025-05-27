import { forwardRef, Module } from '@nestjs/common';
import { ChatsService } from './chats/chats.service';
import { ChatsController } from './chats/chats.controller';
import { MessagesModule } from '@/messages/messages.module';
import { ChatGateway } from './chats/chats.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/schema/user.entity';
import { Chat } from '@/schema/chat.entity';
import { Message } from '@/schema/message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Chat, Message]),
    forwardRef(() => MessagesModule), // <-- use forwardRef here too
  ],
  providers: [ChatsService, ChatGateway],
  controllers: [ChatsController]
})
export class ChatsModule {}
