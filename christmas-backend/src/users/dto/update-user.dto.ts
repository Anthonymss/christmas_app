import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class UpdateUserDto {
    @IsString()
    @MinLength(3)
    @MaxLength(30)
    @Matches(/^[a-zA-Z0-9_.\- ]+$/, {
        message: 'username solo puede contener letras, números, _, ., - y espacios',
    })
    username: string;
}
