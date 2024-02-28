import { Injectable } from '@nestjs/common';
import { CreateAllergenDto } from './dto/create-allergen.dto';
import { UpdateAllergenDto } from './dto/update-allergen.dto';

@Injectable()
export class AllergensService {
  create(createAllergenDto: CreateAllergenDto) {
    return 'This action adds a new allergen';
  }

  findAll() {
    return `This action returns all allergens`;
  }

  findOne(id: number) {
    return `This action returns a #${id} allergen`;
  }

  update(id: number, updateAllergenDto: UpdateAllergenDto) {
    return `This action updates a #${id} allergen`;
  }

  remove(id: number) {
    return `This action removes a #${id} allergen`;
  }
}
