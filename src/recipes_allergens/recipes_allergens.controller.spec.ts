import { Test, TestingModule } from '@nestjs/testing';
import { RecipesAllergensController } from './recipes_allergens.controller';
import { RecipesAllergensService } from './recipes_allergens.service';

describe('RecipesAllergensController', () => {
  let controller: RecipesAllergensController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipesAllergensController],
      providers: [RecipesAllergensService],
    }).compile();

    controller = module.get<RecipesAllergensController>(RecipesAllergensController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
