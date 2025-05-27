import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesService } from './messages/messages.service';
import { MessagesController } from './messages/messages.controller';
import { Message, MessageSchema } from './schema/message.schema';
import { Chat, ChatSchema } from '../chats/schema/chat.schema';
import { ChatsModule } from '../chats/chats.module';
import { MessageGateway } from './messages/gateway/message.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: Chat.name, schema: ChatSchema }, // for lastMessage updates
    ]),
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
