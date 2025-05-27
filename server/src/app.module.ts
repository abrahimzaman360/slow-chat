import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ChatsModule } from './modules/chats/chats.module';
import { MessagesModule } from './modules/messages/messages.module';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/schema/user.entity';
import { Chat } from '@/schema/chat.entity';
import { Message } from '@/schema/message.entity';
import { SessionEntity } from '@/schema/session.entity';

@Module({
  imports: [
    UsersModule,
    ChatsModule,
    MessagesModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'mrtux',
      password: 'mrtux360',
      database: 'slowchat',
      entities: [User, Chat, Message, SessionEntity],
      synchronize: true,
      autoLoadEntities: true,
    }),
  ],
})
export class AppModule {
  constructor() {
    console.log('AppModule initialized...');
  }
}
