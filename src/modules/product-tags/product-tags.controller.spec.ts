import { Test, TestingModule } from '@nestjs/testing';
import { ProductTagsController } from './product-tags.controller';
import { ProductTagsService } from './product-tags.service';

describe('ProductTagsController', () => {
  let controller: ProductTagsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductTagsController],
      providers: [ProductTagsService],
    }).compile();

    controller = module.get<ProductTagsController>(ProductTagsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
