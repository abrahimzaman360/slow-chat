import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Message } from './message.entity';
import { Chat } from './chat.entity';

@Entity()
@Unique(['username'])
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column()
  password: string;

  @OneToMany(() => Message, (message) => message.sender)
  messages: Message[];

  // Participant Chats
  @ManyToMany(() => Chat, (chat) => chat.participants)
  @JoinTable({
    name: 'user_chats', // optional: explicit join table
    joinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'chatId',
      referencedColumnName: 'id',
    },
  })
  chats: Chat[];

  // Admin Chats
  @ManyToMany(() => Chat, (chat) => chat.admins)
  @JoinTable({
    name: 'admin_chats',
    joinColumn: {
      name: 'adminId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'chatId',
      referencedColumnName: 'id',
    },
  })
  adminInChats: Chat[];
}
