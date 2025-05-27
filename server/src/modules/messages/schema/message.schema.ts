import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  FILE = 'file',
}

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Message {
  @Prop({ type: Types.ObjectId, ref: 'Chat', required: true })
  chat: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sender: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ enum: MessageType, default: MessageType.TEXT })
  type: MessageType;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  readBy: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'Message' })
  repliedTo?: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  deletedFor: Types.ObjectId[];

  @Prop({
    type: Map,
    of: [{ type: Types.ObjectId, ref: 'User' }],
    default: {},
  })
  reactions: Map<string, Types.ObjectId[]>;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
