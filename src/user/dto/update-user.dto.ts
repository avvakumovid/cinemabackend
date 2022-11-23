import { IsEmail, IsString, MinLength } from 'class-validator'

export class UpdateUserDro {
    @IsEmail()
    email: string

    password?: string

     isAdmin?: boolean
}