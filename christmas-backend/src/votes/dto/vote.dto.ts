import { IsInt, IsEnum, IsOptional } from 'class-validator';

export class VoteDto {
  @IsInt()
  drawingId: number;

  @IsOptional()
  @IsEnum(['HEART', 'LAUGH', 'WOW', 'CHRISTMAS'])
  type?: string;
}
