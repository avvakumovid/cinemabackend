import { prop, Ref } from '@typegoose/typegoose'
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { GenreModel } from 'src/genre/genre.model';
import { ActorModel } from './../actor/actor.model';


export interface MovieModel extends Base { }

export class Parameter {
    @prop()
    year: number

    @prop()
    duration: number

    @prop()
    country: string
}

export class MovieModel extends TimeStamps {

    @prop()
    poster: string

    @prop()
    bigPoster: string

    @prop()
    title: string


    @prop()
    slug: string

    @prop()
    parameters?: Parameter

    @prop({ default: 4.0 })
    rating?: number

    @prop()
    videoUrl: string

    @prop({ default: 0 })
    countOpened?: number

    @prop({ ref: () => GenreModel })
    genres: Ref<GenreModel>[]

    @prop({ ref: () => ActorModel })
    actors: Ref<ActorModel>[]

    @prop({ default: false })
    isSendTelegram?: boolean
}