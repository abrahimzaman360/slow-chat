import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  Unique,
} from 'typeorm';
import { Message } from './message.entity';
import { Chat } from './chat.entity';

@Entity()
@Unique(['username'])
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Name fields
  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  username: string;

  @Column({ type: 'varchar', nullable: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  phone?: string;

  @Column({ type: 'varchar', nullable: true })
  password?: string | null;

  @Column({ type: 'varchar', nullable: true })
  avatarUrl: string;

  // OAuth fields
  @Column({ type: 'varchar', nullable: true, default: null })
  oauthProvider?: string | null;

  @Column({ type: 'varchar', nullable: true, default: null })
  oauthProviderId?: string | null;

  @Column({ type: 'varchar', nullable: true })
  twoFactorSecret?: string; // For 2FA TOTP secret

  @Column({ type: 'boolean', default: false })
  twoFactorEnabled: boolean; // 2FA status

  @Column({ type: 'varchar', nullable: true })
  rememberMeToken?: string; // For "Remember Me" persistent login

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
