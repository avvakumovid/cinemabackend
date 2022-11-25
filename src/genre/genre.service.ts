import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { genSalt, hash } from 'bcryptjs';
import { InjectModel } from 'nestjs-typegoose';
import { UpdateUserDro } from 'src/user/dto/update-user.dto';
import { GenreModel } from './genre.model';
import { CreateGenreDto } from './dto/create-genre.dto';
import { MovieService } from './../movie/movie.service';
import { Collection } from './genre.interface';

@Injectable()
export class GenreService {
    constructor(@InjectModel(GenreModel) private readonly GenreModel: ModelType<GenreModel>,
        private readonly MovieService: MovieService) { }

    async bySlug(slug: string) {
        const doc = await this.GenreModel.findOne({ slug }).exec()
        if (!doc) throw new NotFoundException('Genre not found!')
        return doc

    }

    async getCount() {
        return await this.GenreModel.find().count().exec()
    }

    async getAll(searchTerm?: string) {
        let options = {}

        if (searchTerm) {
            options = {
                $or: [
                    {
                        name: RegExp(searchTerm, 'i')
                    },
                    {
                        slug: RegExp(searchTerm, 'i')
                    },
                    {
                        description: RegExp(searchTerm, 'i')
                    },
                ]
            }
        }
        return await this.GenreModel.find(options).select('-password -updatedAt -__v').sort({ createdAt: 'desc' }).exec()
    }

    async getCollections() {
        const genres = await this.getAll()
        const collections = await Promise.all(genres.map(async genre => {
            const moviesByGenre = await this.MovieService.byGenres([genre._id])

            const result: Collection = {
                _id: String(genre._id),
                image: moviesByGenre[0].bigPoster,
                title: genre.name,
                slug: genre.slug,
            }
            return result
        }))
        return collections
    }

    /* Admin Place */

    async byId(_id: string) {
        const genre = await this.GenreModel.findById(_id)
        if (!genre) throw new NotFoundException('Genre not found!')
        return genre
    }

    async create() {
        const defaultValue: CreateGenreDto = {
            'description': '',
            'name': '',
            'icon': '',
            'slug': ''
        }

        const genre = await this.GenreModel.create(defaultValue)
        return genre._id
    }


    async update(_id: string, dto: CreateGenreDto) {
        const updateDoc = await this.GenreModel.findByIdAndUpdate(_id, dto, {
            new: true
        }).exec()

        if (!updateDoc) throw new NotFoundException('Genre not found!')

        return updateDoc
    }

    async delete(_id: string) {
        const deleteDoc = await this.GenreModel.findByIdAndDelete(_id).exec()

        if (!deleteDoc) throw new NotFoundException('Genre not found!')

        return deleteDoc

    }
}
