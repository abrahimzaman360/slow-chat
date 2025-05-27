import { ISession } from 'connect-typeorm';
import {
  Entity,
  Column,
  PrimaryColumn,
  Index,
  DeleteDateColumn,
} from 'typeorm';

@Entity('sessions')
export class SessionEntity implements ISession {
  @PrimaryColumn('varchar', { length: 255 })
  id: string;

  @Column('text')
  json: string;

  @Index()
  @Column('bigint')
  expiredAt: number;

  @DeleteDateColumn()
  destroyedAt?: Date;
}
