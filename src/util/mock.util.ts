import { faker } from '@faker-js/faker';

interface VehicleType {
  id?: number;
  typeId: number;
  typeName: string;
}

const getRandomInt = (max: number): number => {
  return Math.floor(Math.random() * max) + 1;
};

export const generateMockVehicleTypes = (): VehicleType[] => {
  const mocks: VehicleType[] = [];
  const count = getRandomInt(3);
  for (let i = 1; i <= count; i++) {
    const type = faker.vehicle.type();
    mocks.push({
      typeId: i,
      typeName: type,
    });
  }

  return mocks;
};
