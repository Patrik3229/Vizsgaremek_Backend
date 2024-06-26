import { Injectable } from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class RatingsService {
  constructor(private readonly db: PrismaService) { }

  /**
   * új rating készítése
   * @param createRatingDto rating tartalma
   * @param user_id az user id aki csinálja
   * @returns új recetpet
   */
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
  /**
   * rating listázó
   * @returns összes receptet
   */
  async findAll() {
    return await this.db.$queryRaw`SELECT r.id,r.rating,r.content,r.recipe_id,r.posted, r.user_id,users.name as 'username' FROM ratings AS R INNER JOIN users ON r.user_id = users.id INNER JOIN recipes ON r.recipe_id = recipes.id`
  }

  async findRecipe(recipe_id: number){
    return await this.db.ratings.findMany({
      where : {
        recipe_id : recipe_id
      }
    });
  }

  /**
   * rating listázó
   * @param user_id user id-ja
   * @returns user ősszes rating-jét
   */
  findAllByUser(user_id: number) {
    return this.db.ratings.findMany({
      where: { user_id }
    });
  }

  /**
   * rating megkeresése id szerint
   * @param id rating id-ja
   * @returns 1 rating
   */
  findOne(id: number) {
    return this.db.ratings.findUnique({
      where: { id }
    });
  }

  /**
   * rating frissítése
   * @param id rating id-ja
   * @param updateRatingDto rating új adatai 
   * @returns frissített rating
   */
  update(id: number, updateRatingDto: UpdateRatingDto) {
    return this.db.ratings.update({
      where: { id },
      data: {
        content: updateRatingDto.content,
        rating: updateRatingDto.rating,
        posted: new Date().toISOString()
      }
    });
  }

  /**
   * rating kitörlése
   * @param id rating id-ja
   * @returns kitörölt rating
   */
  remove(id: number) {
    return this.db.ratings.delete({
      where: { id }
    });
  }

  /**
   * átak értékelés számítás
   * @param id recept id-ja
   * @returns avg rating értékelését, nem kerekített
   */
  avgRating(id: number) {
    return this.db.$queryRaw`SELECT CAST(AVG(rating) AS FLOAT) AS rating FROM ratings WHERE recipe_id = ${id}`;
  }

  /**
   * top 5 recept megkerése
   * @returns a top 5 értékelt recept
   */
  async topFiveRating() {
    return await this.db.$queryRaw`SELECT CAST(AVG(rating) AS FLOAT) AS rating, title, recipes.id FROM ratings INNER JOIN recipes ON ratings.recipe_id = recipes.id GROUP BY recipe_id ORDER BY rating DESC LIMIT 5`
  }
}
