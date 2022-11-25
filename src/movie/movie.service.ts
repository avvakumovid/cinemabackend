import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';
import { MovieModel } from './movie.model';
import { MovieDto } from './movie.dto';
import { Types } from 'mongoose';

@Injectable()
export class MovieService {

    constructor(@InjectModel(MovieModel) private readonly MovieModel: ModelType<MovieModel>) { }

    async bySlug(slug: string) {
        const doc = await this.MovieModel.findOne({ slug }).populate('actors genres').exec()
        if (!doc) throw new NotFoundException('Movie not found!')
        return doc

    }

    async byActor(actorId: Types.ObjectId): Promise<DocumentType<MovieModel>[]> {
        return this.MovieModel.find({ actors: actorId }).exec()
    }

    async byGenres(
        genreIds: Types.ObjectId[]
    ): Promise<DocumentType<MovieModel>[]> {
        return this.MovieModel.find({ genres: { $in: genreIds } }).exec()
    }

    async getCount() {
        return await this.MovieModel.find().count().exec()
    }

    async getAll(searchTerm?: string) {
        let options = {}

        if (searchTerm) {
            options = {
                $or: [
                    {
                        title: RegExp(searchTerm, 'i')
                    },
                ]
            }
        }
        return await this.MovieModel
            .find(options)
            .select('-updatedAt -__v')
            .sort({ createdAt: 'desc' })
            .populate('actors genres').exec()
    }

    async updateCountOpened(slug: string) {
        const updateDoc = await this.MovieModel.findOneAndUpdate(
            {
                slug
            },
            {
                $inc:
                    { countOpened: 1 }
            },
            {
                new: true
            }).exec()

        if (!updateDoc) throw new NotFoundException('Movie not found!')

        return updateDoc
    }


    async getMostPopular() {
        return await this.MovieModel.find({ countOpened: { $gt: 0 } }).populate('genres').sort({ countOpened: -1 }).exec()
    }


    async updateRating(id: string, newRating: number) {
        this.MovieModel.findByIdAndUpdate(id,
            {
                rating: newRating
            },
            {
                new: true
            }
        ).exec()

    }


    /* Admin Place */

    async byId(_id: string) {
        const movie = await this.MovieModel.findById(_id)
        if (!movie) throw new NotFoundException('Movie not found!')
        return movie
    }

    async create() {
        const defaultValue: MovieDto = {
            poster: '',
            bigPoster: '',
            title: '',
            slug: '',
            videoUrl: '',
            genres: [],
            actors: []
        }


        const movie = await this.MovieModel.create(defaultValue)
        return movie._id
    }


    async update(_id: string, dto: MovieDto) {
        const updateDoc = await this.MovieModel.findByIdAndUpdate(_id, dto, {
            new: true
        }).exec()

        if (!updateDoc) throw new NotFoundException('Movie not found!')

        return updateDoc
    }

    async delete(_id: string) {
        const deleteDoc = await this.MovieModel.findByIdAndDelete(_id).exec()

        if (!deleteDoc) throw new NotFoundException('Movie not found!')

        return deleteDoc

    }

}
