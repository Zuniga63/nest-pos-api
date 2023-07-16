import { Test, TestingModule } from '@nestjs/testing';
import { ProductColorsService } from './product-colors.service';

describe('ProductColorsService', () => {
  let service: ProductColorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductColorsService],
    }).compile();

    service = module.get<ProductColorsService>(ProductColorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
