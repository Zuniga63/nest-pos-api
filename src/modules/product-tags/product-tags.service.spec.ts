import { Test, TestingModule } from '@nestjs/testing';
import { ProductTagsService } from './product-tags.service';

describe('ProductTagsService', () => {
  let service: ProductTagsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductTagsService],
    }).compile();

    service = module.get<ProductTagsService>(ProductTagsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
