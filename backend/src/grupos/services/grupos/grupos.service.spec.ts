import { Test, TestingModule } from '@nestjs/testing';
import { GruposService } from './grupos.service';

describe('GruposService', () => {
  let service: GruposService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GruposService],
    }).compile();

    service = module.get<GruposService>(GruposService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
