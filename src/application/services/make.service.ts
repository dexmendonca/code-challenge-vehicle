import { HttpService } from '@nestjs/axios';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { parseStringPromise } from 'xml2js';
import { Make } from '../../domain/entities/make.entity';
import { MakeRepositoryAdapter } from '../../infrastructure/persistence/make.repository.adapter';
import { generateMockVehicleTypes } from '../../util/mock.util';

@Injectable()
export class MakeService implements OnModuleInit {
  constructor(
    private readonly httpService: HttpService,

    private readonly makeRepository: MakeRepositoryAdapter,
  ) {}

  async onModuleInit() {
    const hasData = await this.hasDataInDatabase();

    if (!hasData) {
      console.log('[Sync Module] Fetching Data, please wait ...');
      await this.syncWithExternalAPI();
      console.log('[Sync Module] Finished');
    }
  }

  async syncWithExternalAPI(): Promise<Make[]> {
    const makes = await this.getAllMakers();
    const transformedData = await Promise.all(makes);

    for (const make of transformedData) {
      const existing = await this.makeRepository.findByMakeId(make.makeId);

      if (existing) {
        await this.makeRepository.save({ ...existing, ...make });
      } else {
        await this.makeRepository.save(make);
      }
    }

    return transformedData;
  }

  async getAllMakers(): Promise<any[]> {
    const response = await lastValueFrom(
      this.httpService.get(
        'https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=XML',
      ),
    );
    const jsonData = await parseStringPromise(response.data);

    const allVehicleMakes = jsonData.Response.Results[0].AllVehicleMakes;

    return Promise.all(
      allVehicleMakes.map(async (make) => {
        // NOTE: Due to the rate limit, I switched to mocked data generation,
        //       for more information, read the "Important" section in the README

        // const vehicleTypes = await this.getVehicleTypesForMakeId(make.Make_ID[0]);

        const vehicleTypes = generateMockVehicleTypes();
        return {
          makeId: make.Make_ID[0],
          makeName: make.Make_Name[0],
          vehicleTypes,
        };
      }),
    );
  }

  async getVehicleTypesForMakeId(makeId: number): Promise<any[]> {
    const response = await lastValueFrom(
      this.httpService.get(
        `https://vpic.nhtsa.dot.gov/api/vehicles/GetVehicleTypesForMakeId/${makeId}?format=XML`,
      ),
    );
    const jsonData = await parseStringPromise(response.data);

    const allVehicleTypes =
      jsonData.Response.Results[0].VehicleTypesForMakeIds || [];

    return Promise.all(
      allVehicleTypes.map((vt: any) => ({
        typeId: vt.VehicleTypeId[0],
        typeName: vt.VehicleTypeName[0],
      })),
    );
  }

  async getVehicleByMakeId(makeId: number): Promise<Make | null> {
    return this.makeRepository.findByMakeId(makeId);
  }

  async getAllVehiclesFromDatabase(): Promise<Make[]> {
    return this.makeRepository.findAll();
  }

  async hasDataInDatabase(): Promise<boolean> {
    const count = await this.makeRepository.count();
    return count > 0;
  }
}
