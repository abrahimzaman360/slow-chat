import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { MessageType } from '../schema/message.schema';

export class CreateMessageDto {
  @IsString()
  chatId: string;

  @IsString()
  senderId: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(MessageType)
  @IsOptional()
  type?: MessageType;
}
