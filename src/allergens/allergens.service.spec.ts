import { Test, TestingModule } from '@nestjs/testing';
import { AllergensService } from './allergens.service';

describe('AllergensService', () => {
  let service: AllergensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AllergensService],
    }).compile();

    service = module.get<AllergensService>(AllergensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
