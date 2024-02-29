import { Injectable } from '@nestjs/common';
import { CreateAllergenDto } from './dto/create-allergen.dto';
import { PrismaClient } from '@prisma/client';


@Injectable()
export class AllergensService {
  constructor(private readonly db : PrismaClient) {}

  findAll() {
    return this.db.allergens.findMany();
  }

  findOne(id: number) {
    return this.db.allergens.findUnique({
      where : {id}
    });
  }
}
