import { Module } from '@nestjs/common';
import { AllergensService } from './allergens.service';
import { AllergensController } from './allergens.controller';

@Module({
  controllers: [AllergensController],
  providers: [AllergensService],
})
export class AllergensModule {}
