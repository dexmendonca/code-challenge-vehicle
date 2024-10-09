import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VehicleType } from './vehicle-type.entity';

@ObjectType()
@Entity()
export class Make {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  @Index('make-makeid-idx')
  @Field()
  makeId: number;

  @Column()
  @Field()
  makeName: string;

  @OneToMany(() => VehicleType, (vehicleType) => vehicleType.make, {
    cascade: true,
  })
  @Field(() => [VehicleType])
  vehicleTypes?: VehicleType[];
}
