import { Test, TestingModule } from '@nestjs/testing';
import { ProductColorsController } from './product-colors.controller';
import { ProductColorsService } from './product-colors.service';

describe('ProductColorsController', () => {
  let controller: ProductColorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductColorsController],
      providers: [ProductColorsService],
    }).compile();

    controller = module.get<ProductColorsController>(ProductColorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
