import { IsArray, IsBoolean, IsOptional, IsString, ArrayMinSize, ArrayMaxSize, IsMongoId } from 'class-validator';

export class CreateChatDto {
  @IsArray()
  @IsMongoId({ each: true })
  @ArrayMinSize(2, { message: 'At least 2 participants required' })
  @ArrayMaxSize(2, { message: 'At most 2 participants allowed for 1-on-1 chat' })
  participantIds: string[];

  @IsBoolean()
  isGroup: boolean;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  adminIds?: string[];

  @IsOptional()
  @IsString()
  createdBy?: string;

  @IsOptional()
  @IsString()
  name?: string;
}
