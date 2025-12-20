import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @Matches(/^[a-zA-Z0-9_.-]+$/, {
    message: 'username solo puede contener letras, números, _, ., -',
  })
  username: string;

  @IsString()
  @MinLength(1)
  @MaxLength(72)
  password: string;
}
