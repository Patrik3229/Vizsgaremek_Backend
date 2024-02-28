import { Test, TestingModule } from '@nestjs/testing';
import { AllergensController } from './allergens.controller';
import { AllergensService } from './allergens.service';

describe('AllergensController', () => {
  let controller: AllergensController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AllergensController],
      providers: [AllergensService],
    }).compile();

    controller = module.get<AllergensController>(AllergensController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
