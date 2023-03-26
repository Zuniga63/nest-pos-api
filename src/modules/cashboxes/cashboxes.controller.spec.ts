import { Test, TestingModule } from '@nestjs/testing';
import { CashboxesController } from './cashboxes.controller';
import { CashboxesService } from './cashboxes.service';

describe('CashboxesController', () => {
  let controller: CashboxesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CashboxesController],
      providers: [CashboxesService],
    }).compile();

    controller = module.get<CashboxesController>(CashboxesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
