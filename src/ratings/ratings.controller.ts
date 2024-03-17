import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, BadRequestException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { AuthGuard } from '@nestjs/passport/dist';
import { Ratings, Users } from '@prisma/client';
import { UsersService } from 'src/users/users.service';

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService, private readonly user: UsersService) { }

  /**
  * új rating csinál
  * @param createRatingDto 
  * @returns új ratinget
  */
  @Post('post')
  @UseGuards(AuthGuard('bearer'))
  create(@Body() createRatingDto: CreateRatingDto, @Request() req) {
    const user : Users = req.user
    return this.ratingsService.create(createRatingDto, user.id);
  }

  /**
   * egy receptehz az összes rating kilistázza
   * @param id 
   * @returns rating tömböt
   */
  @Get('getAll')
  findAll(id: number) {
    return this.ratingsService.findAll(id);
  }

  /**
   * egy specifikus rating add vissza
   * @param id 
   * @returns a specifikus ratinget
   */
  @Get('find:id')
  findOne(@Param('id') id: string) {
    console.log('ez a id:' + id)
    return this.ratingsService.findOne(+id);
  }

  /**
   * vissza adja a bejelnekezett user ratingjeit
   * @param req 
   * @returns az összes user ratingjét
   */
  @Get('me:rating')
  @UseGuards(AuthGuard('bearer'))
  meRating(@Request() req) {
    const user: Users = req.user
    return this.ratingsService.findAllByUser(user.id)
  }

  /**
   * user saját ratingjét frissitő function
   * @param req 
   * @param updateRatingDto 
   * @returns 
   */
  @Patch('update')
  @UseGuards(AuthGuard('bearer'))
  update(@Body() updateRatingDto: UpdateRatingDto) {
    return this.ratingsService.update(updateRatingDto.id ,updateRatingDto);
  }

  /**
   * admin rating update
   * @param req 
   * @param updateRatingDto 
   * @param id 
   * @returns 
   */
  @Patch('updateAdmin')
  @UseGuards(AuthGuard('bearer'))
  async updateAdmin(@Request() req, @Body() updateRatingDto: UpdateRatingDto, id: number) {
    const rating: Ratings = req.rating
    const role = await this.user.getRole(rating.user_id)
    if (role != "manager" && role != "admin") {
      throw new UnauthorizedException("You dont have premmision for it")
    }
    return this.ratingsService.update(id, updateRatingDto);
  }

  /**
   * user által törlés
   * @param req 
   * @returns 
   */
  @Delete('delete')
  @UseGuards(AuthGuard('bearer'))
  remove(@Request() req) {
    const rating: Ratings = req.rating
    return this.ratingsService.remove(rating.id);
  }

  /**
   * admin által kitörlés
   * @param req 
   * @param id 
   * @returns 
   */
  @Delete('deleteadmin')
  @UseGuards(AuthGuard('bearer'))
  async removeAdmin(@Request() req, id: number) {
    const rating: Ratings = req.rating
    const role = await this.user.getRole(rating.user_id)
    if (role != "manager" && role != "admin") {
      throw new UnauthorizedException("You dont have premmision for it")
    }
    return this.ratingsService.remove(id);
  }
}
