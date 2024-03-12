import { Injectable } from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class RatingsService {
  constructor(private readonly db: PrismaService) { }

  create(createRatingDto: CreateRatingDto, user_id : number) {
    return this.db.ratings.create({
      data: {
        content: createRatingDto.content,
        rating: createRatingDto.rating,
        recipe_id: createRatingDto.recipe_id,
        user_id: user_id
      }
    });
  }
  findAll(id: number) {
    return this.db.ratings.findMany({
      where: {
        recipe_id: id
      }
    })
  }

  findAllByUser(user_id: number) {
    return this.db.ratings.findMany({
      where: { user_id }
    });
  }

  findOne(id: number) {
    return this.db.ratings.findUnique({
      where: { id }
    });
  }

  update(id: number, updateRatingDto: UpdateRatingDto) {
    return this.db.ratings.update({
      where: { id },
      data: {
        content: updateRatingDto.content,
        rating: updateRatingDto.rating,
        posted: Date.now.toString()
      }
    });
  }

  remove(id: number) {
    return this.db.ratings.delete({
      where: { id }
    });
  }

  avgRating(id: number) {
    return Prisma.raw(`SELECT AVG(rating) AS avg-rating FROM ratings WHERE user_id = ${id}`)
  }

  topFiveRating() {
    return this.db.$queryRaw`SELECT AVG(rating) AS rating, title FROM ratings INNER JOIN recipes ON rating.recipes_id = recipes.id GROUP BY recipes_id ORDER BY rating LIMIT 5`
  }
}
