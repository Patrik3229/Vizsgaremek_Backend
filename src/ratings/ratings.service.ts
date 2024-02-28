import { Injectable } from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class RatingsService {
  constructor(private readonly db : PrismaService) {}

  create(createRatingDto: CreateRatingDto) {
    return this.db.ratings.create({
      data : {
        content : createRatingDto.content,
        rating : createRatingDto.rating,
        recipe_id : createRatingDto.recipe_id,
        user_id : createRatingDto.user_id
      }
    });
  }

  findAllByUser(user_id : number) {
    return this.db.ratings.findMany({
      where : {user_id}
    });
  }

  findOne(id: number) {
    return this.db.ratings.findUnique({
      where : {id}
    });
  }

  update(id: number, updateRatingDto: UpdateRatingDto) {
    return this.db.ratings.update({
      where : {id},
      data : {
        content : updateRatingDto.content,
        rating : updateRatingDto.rating,
        posted : Date.now.toString()
      }
    });
  }

  remove(id: number) {
    return this.db.ratings.delete({
      where : {id}
    });
  }
}
