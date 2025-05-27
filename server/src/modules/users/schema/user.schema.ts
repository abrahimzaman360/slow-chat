import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true, unique: true })
  phoneNumber: string;

  @Prop()
  avatarUrl?: string;

  @Prop()
  status?: string;

  @Prop()
  lastSeen?: Date;

  @Prop({ required: true })
  password: string;  // Assuming you want to store hashed password
}

export const UserSchema = SchemaFactory.createForClass(User);
