import { Test, TestingModule } from '@nestjs/testing';
import { ProductBrandService } from './product-brands.service';

describe('ProductBrandService', () => {
  let service: ProductBrandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductBrandService],
    }).compile();

    service = module.get<ProductBrandService>(ProductBrandService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
