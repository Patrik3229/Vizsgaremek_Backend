import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, BadRequestException, UnauthorizedException, ForbiddenException, ParseIntPipe } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { AuthGuard } from '@nestjs/passport/dist';
import { Users } from '@prisma/client';
import { UsersService } from 'src/users/users.service';

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService, private readonly user: UsersService) { }

  /**
  * új rating csinál
  * @param createRatingDto új rating adatai
  * @returns új ratinget
  */
  @Post('post')
  @UseGuards(AuthGuard('bearer'))
  create(@Body() createRatingDto: CreateRatingDto, @Request() req) {
    const user : Users = req.user
    return this.ratingsService.create(createRatingDto, user.id);
  }

  /**
   * ADMIN FUNCTION
   * Az összes rating kilistázza
   * @param id id-ja
   * @returns rating tömböt
   */
  @Get('getAll')
  @UseGuards(AuthGuard('bearer'))
  async findAll(@Request() req) {
    const users: Users = req.user
    if (users.role != "manager" && users.role != "admin") {
      throw new UnauthorizedException("You dont have premmision for it")
    }
    return this.ratingsService.findAll();
  }

  /**
   * egy specifikus rating add vissza
   * @param id rating id-ja
   * @returns a specifikus ratinget
   */
  @Get('find:id')
  findOne(@Param('id') id: string) {
    return this.ratingsService.findOne(+id);
  }

  /**
   * Egy recepthez tartozó ratingek listázása
   * @param id recept id-ja
   * @returns ratingekből álló listát
   */
  @Get('find-recipe/:id')
  findRecipe(@Param('id', ParseIntPipe) id: number){
    return this.ratingsService.findRecipe(id)
  }

  /**
   * vissza adja a bejelnekezett user ratingjeit
   * @param req a request beköldő token kiolvasott id
   * @returns az összes user ratingjét
   */
  @Get('me:rating')
  @UseGuards(AuthGuard('bearer'))
  meRating(@Request() req) {
    const user: Users = req.user
    return this.ratingsService.findAllByUser(user.id);
  }

  /**
   * Visszaadja az öt legmagasabb értékeléssel rendelkező receptet
   * @returns 
   */
  @Get('top-5')
  topFive(){
    return this.ratingsService.topFiveRating();
  }

  /**
   * egy recept atlag rating adja vissza 
   * @param id recept id
   * @returns avg float kent
   */
  @Get('avg-recipe/:id')
  avgRecipe(@Param('id', ParseIntPipe) id : number){
    return this.ratingsService.avgRating(id)
  }

  /**
   * user saját ratingjét frissitő function
   * @param req a request beköldő token kiolvasott id
   * @param updateRatingDto frissítendő adatok tartalmazza
   * @returns modosított rating
   */
  @Patch('update')
  @UseGuards(AuthGuard('bearer'))
  async update(@Request() req, @Body() updateRatingDto: UpdateRatingDto) {
    const users: Users = req.user
    const sentUsert = await this.ratingsService.findOne(updateRatingDto.id)
    if (users.id != sentUsert.user_id) {
      throw new ForbiddenException('You dont have premmision for it');
    }
    return this.ratingsService.update(updateRatingDto.id ,updateRatingDto);
  }

  /**
   * ADMIN FUNCTION
   * admin rating update
   * @param req a request beköldő token kiolvasott id
   * @param updateRatingDto 
   * @param id rating id
   * @returns modosított rating
   */
  @Patch('updateAdmin:id')
  @UseGuards(AuthGuard('bearer'))
  async updateAdmin(@Request() req, @Body() updateRatingDto: UpdateRatingDto,@Param('id') id: string) {
    const users: Users = req.user
    if (users.role != "manager" && users.role != "admin") {
      throw new UnauthorizedException("You dont have premmision for it")
    }
    return this.ratingsService.update(+id, updateRatingDto);
  }

  /**
   * user által törlés
   * @param req a request beköldő token kiolvasott id
   * @returns kitörölt rating
   */
  @Delete('delete:id')
  @UseGuards(AuthGuard('bearer'))
  remove(@Request() req, @Param('id') id : number) {
    return this.ratingsService.remove(+id);
  }

  /**
   * ADMIN FUNCTION
   * admin által kitörlés
   * @param req a request beköldő token kiolvasott id
   * @param id rating id
   * @returns kitörölt rating
   */
  @Delete('delete-admin/:id')
  @UseGuards(AuthGuard('bearer'))
  async removeAdmin(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const users: Users = req.user
    if (users.role != "manager" && users.role != "admin") {
      throw new UnauthorizedException("You dont have premmision for it")
    }
    return this.ratingsService.remove(id);
  }
}
