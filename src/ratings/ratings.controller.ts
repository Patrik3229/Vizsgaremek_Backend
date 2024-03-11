import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { AuthGuard } from '@nestjs/passport/dist';
import { Ratings, Users } from '@prisma/client';
import { UsersService } from 'src/users/users.service';

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService, private readonly user: UsersService) { }

  @Post('post')
  @UseGuards(AuthGuard('bearer'))
  create(@Body() createRatingDto: CreateRatingDto) {
    return this.ratingsService.create(createRatingDto);
  }

  @Get()
  findAll(id: number) {
    return this.ratingsService.findAll(id);
  }

  @Get('findOne')
  findOne(@Param('id') id: string) {
    return this.ratingsService.findOne(+id);
  }

  @Get('me:rating')
  @UseGuards(AuthGuard('bearer'))
  meRating(@Request() req) {
    const user: Users = req.user
    return this.ratingsService.findAllByUser(user.id)
  }

  @Patch('update')
  @UseGuards(AuthGuard('bearer'))
  update(@Request() req, @Body() updateRatingDto: UpdateRatingDto) {
    const rating: Ratings = req.rating
    return this.ratingsService.update(rating.id, updateRatingDto);
  }

  @Patch('updateAdmin')
  @UseGuards(AuthGuard('bearer'))
  async updateAdmin(@Request() req, @Body() updateRatingDto: UpdateRatingDto, id: number) {
    const rating: Ratings = req.rating
    const role = await this.user.getRole(rating.user_id)
    if (role.role != "manager" && role.role != "admin") {
      throw new UnauthorizedException("You dont have premmision for it")
    }
    return this.ratingsService.update(id, updateRatingDto);
  }

  @Delete('delete')
  @UseGuards(AuthGuard('bearer'))
  remove(@Request() req) {
    const rating: Ratings = req.rating
    return this.ratingsService.remove(rating.id);
  }

  @Delete('deleteadmin')
  @UseGuards(AuthGuard('bearer'))
  async removeAdmin(@Request() req, id: number) {
    const rating: Ratings = req.rating
    const role = await this.user.getRole(rating.user_id)
    if (role.role != "manager" && role.role != "admin") {
      throw new UnauthorizedException("You dont have premmision for it")
    }
    return this.ratingsService.remove(id);
  }
}
