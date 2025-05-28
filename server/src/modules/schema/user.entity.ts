import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable, Unique } from 'typeorm';
import { Message } from './message.entity';
import { Chat } from './chat.entity';

@Entity()
@Unique(['username'])
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Name fields
  @Column({ type: 'varchar', nullable: true})
  name: string;

  @Column({ type: 'varchar', nullable: true })
  username: string;

  @Column({ type: 'varchar', nullable: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  phone?: string;

  @Column({ type: 'varchar', nullable: true })
  password?: string | null;

  // OAuth fields
  @Column({ type: 'varchar', nullable: true, default: null })
  oauthProvider?: string | null;

  @Column({ type: 'varchar', nullable: true, default: null })
  oauthProviderId?: string | null;

  @Column({ type: 'varchar', nullable: true })
  avatarUrl: string;

  @Column({ type: 'varchar', nullable: true })
  displayName: string;

  @OneToMany(() => Message, (message) => message.sender)
  messages: Message[];

  @ManyToMany(() => Chat, (chat) => chat.participants)
  @JoinTable({
    name: 'user_chats',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'chatId', referencedColumnName: 'id' },
  })
  chats: Chat[];

  @ManyToMany(() => Chat, (chat) => chat.admins)
  @JoinTable({
    name: 'admin_chats',
    joinColumn: { name: 'adminId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'chatId', referencedColumnName: 'id' },
  })
  adminInChats: Chat[];
}
