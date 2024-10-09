import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Make } from '../../domain/entities/make.entity';
import { MakeRepositoryPort } from '../../domain/repositories/make.repository';

@Injectable()
export class MakeRepositoryAdapter implements MakeRepositoryPort {
  constructor(
    @InjectRepository(Make)
    private readonly repository: Repository<Make>,
  ) {}

  async save(make: Make): Promise<Make> {
    return this.repository.save(make);
  }

  async findByMakeId(makeId: number): Promise<Make | null> {
    return this.repository.findOne({
      where: { makeId },
      relations: ['vehicleTypes'],
    });
  }

  async findAll(): Promise<Make[]> {
    return this.repository.find({ relations: ['vehicleTypes'] });
  }

  async count(): Promise<number> {
    return this.repository.count();
  }
}
