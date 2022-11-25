import { Body, Controller, Delete, Get, HttpCode, Param, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorators';
import { User } from './decorators/user.decorator';
import { UserService } from './user.service';
import { UpdateUserDro } from './dto/update-user.dto';
import { IdValidationPipe } from 'src/pipes/id.validation.pipe';
import { Types } from 'mongoose';
import { UserModel } from 'src/user/user.model';

@Controller('user')
export class UserController {

    constructor(private readonly UserService: UserService) { }

    @Get('profile')
    @Auth()
    async getProfile(@User('_id') _id: string) {
        return this.UserService.byId(_id)
    }

    @UsePipes(new ValidationPipe())
    @Put('profile')
    @HttpCode(200)
    @Auth()
    async updateProfile(@User('_id') _id: string, @Body() dto: UpdateUserDro) {
        return this.UserService.updateProfile(_id, dto)
    }


    @Get('profile/favorites')
    @Auth()
    async getFavorites(@User('_id') _id: Types.ObjectId) {
        return this.UserService.getFavoriteMovies(_id)
    }


    @Put('profile/favorites')
    @HttpCode(200)
    @Auth()
    async toggleFavorites(@User() user: UserModel, @Body('movieId') movieId: Types.ObjectId) {
        return this.UserService.toggleFavorites(movieId, user)
    }

    @Get('count')
    @Auth('admin')
    async getCountUsers() {
        return this.UserService.getCount()
    }

    @Get()
    @Auth('admin')
    async getUsers(@Query('searchTerm') searchTerm?: string) {
        return this.UserService.getAll(searchTerm)
    }

    @Get(':id')
    @Auth('admin')
    async getUser(@Param('id', IdValidationPipe) _id: string) {
        return this.UserService.byId(_id)
    }

    @UsePipes(new ValidationPipe())
    @Put(':id')
    @HttpCode(200)
    @Auth('admin')
    async updateUser(@Param('id', IdValidationPipe) _id: string, @Body() dto: UpdateUserDro) {
        return this.UserService.updateProfile(_id, dto)
    }

    @UsePipes(new ValidationPipe())
    @Delete(':id')
    @HttpCode(200)
    @Auth('admin')
    async deleteUser(@Param('id', IdValidationPipe) _id: string) {
        return await this.UserService.delete(_id)
    }
}
