import { Args, Query, Resolver } from '@nestjs/graphql';
import { MakeService } from '../../../application/services/make.service';
import { FIVE_MINUTES } from '../../../constants/time.constant';
import { Make } from '../../../domain/entities/make.entity';
import { RedisCacheService } from '../../../infrastructure/cache/redis-cache.service';

@Resolver(() => Make)
export class MakeResolver {
  constructor(
    private readonly makerService: MakeService,
    private readonly cacheService: RedisCacheService,
  ) {}

  @Query(() => [Make])
  async GetMakes() {
    const cacheKey = 'all-vehicles';
    const cachedData = await this.cacheService.get<Make[]>(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const hasData = await this.makerService.hasDataInDatabase();
    if (!hasData) {
      await this.makerService.syncWithExternalAPI();
    }

    const data = await this.makerService.getAllVehiclesFromDatabase();
    await this.cacheService.set(cacheKey, data, FIVE_MINUTES);
    return data;
  }

  @Query(() => Make, { nullable: true })
  async GetMake(@Args('makeId') makeId: number) {
    const cacheKey = `vehicle-${makeId}`;
    const cachedData = await this.cacheService.get<Make>(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const hasData = await this.makerService.hasDataInDatabase();
    if (!hasData) {
      await this.makerService.syncWithExternalAPI();
    }

    const vehicle = await this.makerService.getVehicleByMakeId(makeId);

    await this.cacheService.set(cacheKey, vehicle, 300);
    return vehicle;
  }
}
