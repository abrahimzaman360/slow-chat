import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ChatDocument = HydratedDocument<Chat>;

@Schema({ timestamps: true })
export class Chat {
  @Prop()
  name?: string; // group chat name

  @Prop({ required: true, default: false })
  isGroup: boolean;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'User' }],
    required: true,
    validate: {
      validator: (v: Types.ObjectId[]) => v.length === 2,
      message: '1-on-1 chats must have exactly 2 participants',
    },
  })
  participants: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  admins?: Types.ObjectId[]; // for groups only

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Message' })
  lastMessage?: Types.ObjectId;

  @Prop()
  avatarUrl?: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
