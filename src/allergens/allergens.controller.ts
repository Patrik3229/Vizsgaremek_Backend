import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AllergensService } from './allergens.service';

@Controller('allergens')
export class AllergensController {
  constructor(private readonly allergensService: AllergensService) {}

  @Get()
  findAll() {
    return this.allergensService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.allergensService.findOne(+id);
  }
}
