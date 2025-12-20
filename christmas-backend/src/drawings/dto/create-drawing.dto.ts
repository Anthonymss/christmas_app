import { IsIn } from 'class-validator';

export class CreateDrawingDto {
  @IsIn(['CONCURSO', 'NAVIDAD_FEA'])
  category: 'CONCURSO' | 'NAVIDAD_FEA';
}
