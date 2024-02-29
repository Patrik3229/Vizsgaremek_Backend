import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';


@Injectable()
export class AllergensService {
  constructor(private readonly db : PrismaService) {}

  findAll() {
    return this.db.allergens.findMany();
  }

  findOne(id: number) {
    return this.db.allergens.findUnique({
      where : {id}
    });
  }
}
