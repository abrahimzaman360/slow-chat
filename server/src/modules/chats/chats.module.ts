import { forwardRef, Module } from '@nestjs/common';
import { ChatsService } from './chats/chats.service';
import { ChatsController } from './chats/chats.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './schema/chat.schema';
import { MessagesModule } from '../messages/messages.module';
import { ChatGateway } from './chats/chats.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    forwardRef(() => MessagesModule), // <-- use forwardRef here too
  ],
  providers: [ChatsService, ChatGateway],
  controllers: [ChatsController],
  exports: [
    MongooseModule,
  ]
})
export class ChatsModule {}
