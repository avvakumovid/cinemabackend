import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorators';
import { IdValidationPipe } from 'src/pipes/id.validation.pipe';
import { MovieDto } from './movie.dto';
import { MovieService } from './movie.service';
import { Types } from 'mongoose';
import { ByGenreDto } from './dto/byGenre.dto copy';

@Controller('movie')
export class MovieController {
    constructor(private readonly MovieService: MovieService) { }


    @Get('by-slug/:slug')
    async getBySlug(@Param('slug') slug: string) {
        return this.MovieService.bySlug(slug)
    }

    @Get('by-actor/:actorId')
    async byActor(@Param('actorId', IdValidationPipe) actorId: Types.ObjectId) {
        return this.MovieService.byActor(actorId)
    }

    @Post('by-genres')
    @HttpCode(200)
    async byGenres(
        @Body('genreIds')
        genreIds: Types.ObjectId[]
    ) {
        return this.MovieService.byGenres(genreIds)
    }

    @Put('update-count-opened')
    @HttpCode(200)
    async updateCountOpened(@Body('slug') slug: string) {
        return this.MovieService.updateCountOpened(slug)
    }

    @Get()
    async getAll(@Query('searchTerm') searchTerm?: string) {
        return this.MovieService.getAll(searchTerm)
    }

    @Get('most-popular')
    async getMostPopular() {
        return this.MovieService.getMostPopular()
    }

    @Get(':id')
    @Auth('admin')
    async get(@Param('id', IdValidationPipe) _id: string) {
        return this.MovieService.byId(_id)
    }

    @UsePipes(new ValidationPipe())
    @Post()
    @HttpCode(200)
    @Auth('admin')
    async create() {
        return this.MovieService.create()
    }

    @UsePipes(new ValidationPipe())
    @Put(':id')
    @HttpCode(200)
    @Auth('admin')
    async update(@Param('id', IdValidationPipe) _id: string, @Body() dto: MovieDto) {
        return this.MovieService.update(_id, dto)
    }

    @UsePipes(new ValidationPipe())
    @Delete(':id')
    @HttpCode(200)
    @Auth('admin')
    async deleteUser(@Param('id', IdValidationPipe) _id: string) {
        return await this.MovieService.delete(_id)
    }
}
