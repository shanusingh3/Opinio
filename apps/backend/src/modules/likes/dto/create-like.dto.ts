import { IsOptional, IsString, ValidateIf } from 'class-validator';

export class CreateLikeDto {
  @ValidateIf((o) => !o.commentId)
  @IsString()
  postId?: string;

  @ValidateIf((o) => !o.postId)
  @IsString()
  commentId?: string;
}
