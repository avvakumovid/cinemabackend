import { IsString, IsEmail, MinLength } from 'class-validator'

export class AuthDto {


    @IsEmail()
    email: string

    @MinLength(6, {
        message: 'Passport cannot be less than 6 characters!'
    })
    @IsString()
    password: string
}