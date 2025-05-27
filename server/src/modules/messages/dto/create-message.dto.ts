import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { MessageType } from '@/schema/message.entity';

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
