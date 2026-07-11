import { IsEnum, IsNotEmpty, IsOptional, IsString, IsArray, ValidateNested, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export enum PostType {
  QUESTION = 'QUESTION',
  POLL = 'POLL',
}

export class PollOptionDto {
  @IsString()
  @IsNotEmpty()
  text: string;
}

export class CreatePostDto {
  @IsEnum(PostType)
  type: PostType;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PollOptionDto)
  pollOptions?: PollOptionDto[];

  @IsOptional()
  @IsDateString()
  pollEndsAt?: string;
}
