import { Make } from '../entities/make.entity';

export abstract class MakeRepositoryPort {
  abstract save(make: Make): Promise<Make>;
  abstract findByMakeId(makeId: number): Promise<Make | null>;
  abstract findAll(): Promise<Make[]>;
  abstract count(): Promise<number>;
}
