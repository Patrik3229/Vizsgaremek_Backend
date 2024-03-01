import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post('post')
  create(@Body() createRatingDto: CreateRatingDto) {
    return this.ratingsService.create(createRatingDto);
  }

  // @Get()
  // findAll() {
  //   return this.ratingsService.findAll();
  // }

  @Get('find:id')
  findOne(@Param('id') id: string) {
    return this.ratingsService.findOne(+id);
  }

  @Patch('update:id')
  update(@Param('id') id: string, @Body() updateRatingDto: UpdateRatingDto) {
    return this.ratingsService.update(+id, updateRatingDto);
  }

  @Delete('delete:id')
  remove(@Param('id') id: string) {
    return this.ratingsService.remove(+id);
  }
}
