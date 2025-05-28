import {
  Entity,
  Column,
  PrimaryColumn,
  Index,
  DeleteDateColumn,
} from 'typeorm';

@Entity('sessions')
export class SessionEntity {
  @PrimaryColumn('varchar')
  id: string;

  @Column('text')
  json: string;

  @Index()
  @Column('bigint')
  expiredAt: number;

  @DeleteDateColumn({ nullable: true })
  destroyedAt?: Date;
}
