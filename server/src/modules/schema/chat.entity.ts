import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Message } from './message.entity';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name?: string;

  @Column()
  isGroup: boolean;

  @ManyToMany(() => User, (user) => user.chats)
  participants: User[];

  @ManyToMany(() => User, (user) => user.adminInChats)
  admins: User[];

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];
}
