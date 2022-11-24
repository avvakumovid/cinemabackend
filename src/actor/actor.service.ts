import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ActorModel } from './actor.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { ActorDto } from './actor.dto';

@Injectable()
export class ActorService {

    constructor(@InjectModel(ActorModel) private readonly ActorModel: ModelType<ActorModel>) { }
    async bySlug(slug: string) {
        const doc = await this.ActorModel.findOne({ slug }).exec()
        if (!doc) throw new NotFoundException('Actor not found!')
        return doc

    }

    async getCount() {
        return await this.ActorModel.find().count().exec()
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
                ]
            }
        }



        return await this.ActorModel.aggregate().match(options).lookup({
            from: 'Movie',
            localField: '_id',
            foreignField: 'actors',
            as: 'movies'
        }).addFields({
            countMovies: {
                $size: '$movies'
            }
        })
            .project({
                __v: 0,
                updatedAt: 0,
                movies: 0 
            })
            .sort({ createdAt: -1 }).exec()
    }


    /* Admin Place */

    async byId(_id: string) {
        const actor = await this.ActorModel.findById(_id)
        if (!actor) throw new NotFoundException('Actor not found!')
        return actor
    }

    async create() {
        const defaultValue: ActorDto = {
            'name': '',
            'photo': '',
            'slug': ''
        }

        const actor = await this.ActorModel.create(defaultValue)
        return actor._id
    }


    async update(_id: string, dto: ActorDto) {
        const updateDoc = await this.ActorModel.findByIdAndUpdate(_id, dto, {
            new: true
        }).exec()

        if (!updateDoc) throw new NotFoundException('Actor not found!')

        return updateDoc
    }

    async delete(_id: string) {
        const deleteDoc = await this.ActorModel.findByIdAndDelete(_id).exec()

        if (!deleteDoc) throw new NotFoundException('Actor not found!')

        return deleteDoc

    }
}
