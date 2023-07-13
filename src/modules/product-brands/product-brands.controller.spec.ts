import { Test, TestingModule } from '@nestjs/testing';
import { ProductBrandController } from './product-brands.controller';
import { ProductBrandService } from './product-brands.service';

describe('ProductBrandController', () => {
  let controller: ProductBrandController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductBrandController],
      providers: [ProductBrandService],
    }).compile();

    controller = module.get<ProductBrandController>(ProductBrandController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
