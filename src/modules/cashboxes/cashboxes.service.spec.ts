import { Test, TestingModule } from '@nestjs/testing';
import { CashboxesService } from './cashboxes.service';

describe('CashboxesService', () => {
  let service: CashboxesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CashboxesService],
    }).compile();

    service = module.get<CashboxesService>(CashboxesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
