import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { ChatsModule } from './modules/chats/chats.module';
import { MessagesModule } from './modules/messages/messages.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mrtux:mrtux360@localhost:27017/slowchat?authSource=admin'),
    UsersModule,
    ChatsModule,
    MessagesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
