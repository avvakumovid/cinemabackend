import { IsNumber, IsString, Max, Min } from 'class-validator';

export class RatingDto {

    @IsString()
    movieId: string

    @IsNumber()
    @Min(1)
    @Max(5)
    value: number

}