import { Test, TestingModule } from '@nestjs/testing';
import { RecipesAllergensService } from './recipes_allergens.service';

describe('RecipesAllergensService', () => {
  let service: RecipesAllergensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecipesAllergensService],
    }).compile();

    service = module.get<RecipesAllergensService>(RecipesAllergensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
