import { IsString, IsNumber, IsArray, IsBoolean, IsObject } from 'class-validator';

export class Parameter {
    @IsNumber()
    year: number

    @IsNumber()
    duration: number

    @IsString()
    country: string
}

export class MovieDto {
    @IsString()
    poster: string

    @IsString()
    bigPoster: string

    @IsString()
    title: string


    @IsString()
    slug: string

    @IsObject()
    parameters?: Parameter

    @IsString()
    videoUrl: string

    @IsArray()
    @IsString({ each: true })
    genres: string[]

    @IsArray()
    @IsString({ each: true })
    actors: string[]

    isSendTelegram?: boolean
}