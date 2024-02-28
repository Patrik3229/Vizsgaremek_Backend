import { Injectable } from '@nestjs/common';
import { CreateAllergenDto } from './dto/create-allergen.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AllergensService {
  constructor(private readonly db : PrismaClient) {}
  
  findAll() {
    return `This action returns all allergens`;
  }

  findOne(id: number) {
    return `This action returns a #${id} allergen`;
  }
}
