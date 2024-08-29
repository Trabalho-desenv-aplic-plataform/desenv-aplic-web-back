import { Test, TestingModule } from '@nestjs/testing';
import { GruposController } from './grupos.controller';

describe('GruposController', () => {
  let controller: GruposController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GruposController],
    }).compile();

    controller = module.get<GruposController>(GruposController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
