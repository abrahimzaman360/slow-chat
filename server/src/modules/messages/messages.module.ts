import { forwardRef, Module } from '@nestjs/common';
import { MessagesService } from './messages/messages.service';
import { MessagesController } from './messages/messages.controller';
import { ChatsModule } from '../chats/chats.module';
import { MessageGateway } from './messages/gateway/message.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/schema/user.entity';
import { Message } from '@/schema/message.entity';
import { Chat } from '@/schema/chat.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Message, Chat]),
    forwardRef(() => ChatsModule), // <-- use forwardRef here too
  ],
  controllers: [
    MessagesController
  ],
  providers: [
    MessagesService, 
    MessageGateway
  ],
  exports: [
    MessagesService,
  ]
})
export class MessagesModule {}
