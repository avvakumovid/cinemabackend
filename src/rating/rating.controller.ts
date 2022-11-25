import { Body, Controller, Get, HttpCode, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorators';
import { User } from 'src/user/decorators/user.decorator';
import { RatingService } from './rating.service';
import { RatingDto } from './rating.dto';
import { Types } from 'mongoose';
import { IdValidationPipe } from './../pipes/id.validation.pipe';

@Controller('rating')
export class RatingController {

    constructor(private readonly RatingService: RatingService) { }



    @UsePipes(new ValidationPipe())
    @Post('set-rating')
    @HttpCode(200)
    @Auth()
    async setRating(
        @User('_id') userId: Types.ObjectId,
        @Body()
        dto: RatingDto
    ) {
        return this.RatingService.setRating(userId, dto)
    }

    @Get('/:movieId')
    @Auth()
    async getMovieValueByUser(
        @Param('movieId', IdValidationPipe) movieId: Types.ObjectId,
        @User('_id') userId: Types.ObjectId
    ) {
        return this.RatingService.getMovieValueByUser(movieId, userId)
    }
}
