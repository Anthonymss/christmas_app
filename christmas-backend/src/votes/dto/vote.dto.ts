import { IsInt } from 'class-validator';

export class VoteDto {
  @IsInt()
  drawingId: number;
}
