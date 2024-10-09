import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Make } from './make.entity';

@ObjectType()
@Entity()
export class VehicleType {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  @Field()
  typeId: number;

  @Column()
  @Field()
  typeName: string;

  @ManyToOne(() => Make, (make) => make.vehicleTypes)
  @Index('vehicletype-make-idx')
  @Field(() => Make)
  make?: Make;
}
