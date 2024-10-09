import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { Make } from '../../domain/entities/make.entity';
import { MakeRepositoryAdapter } from '../../infrastructure/persistence/make.repository.adapter';
import { generateMockVehicleTypes } from '../../util/mock.util';
import { MakeService } from './make.service';

jest.mock('xml2js', () => {
  return {
    parseStringPromise: jest.fn((xml) => {
      if (xml.includes('VehicleTypesForMakeIds')) {
        return Promise.resolve({
          Response: {
            Results: [
              {
                VehicleTypesForMakeIds: [
                  {
                    VehicleTypeId: ['1'],
                    VehicleTypeName: ['Sedan'],
                  },
                ],
              },
            ],
          },
        });
      }

      return Promise.resolve({
        Response: {
          Results: [
            {
              AllVehicleMakes: [
                {
                  Make_ID: ['123'],
                  Make_Name: ['Test Make'],
                },
              ],
            },
          ],
        },
      });
    }),
  };
});

jest.mock('../../util/mock.util', () => ({
  generateMockVehicleTypes: jest.fn(() => [
    { typeId: 1, typeName: 'Convertible' },
    { typeId: 2, typeName: 'Passenger Van' },
  ]),
}));

describe('MakeService', () => {
  let service: MakeService;
  let httpService: HttpService;
  let makeRepository: MakeRepositoryAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MakeService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: MakeRepositoryAdapter,
          useValue: {
            findByMakeId: jest.fn(),
            save: jest.fn((make) => ({
              ...make,
              id: make.id ?? 1,
            })),
            findAll: jest.fn(),
            count: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MakeService>(MakeService);
    httpService = module.get<HttpService>(HttpService);
    makeRepository = module.get<MakeRepositoryAdapter>(MakeRepositoryAdapter);
  });

  describe('syncWithExternalAPI', () => {
    it('should fetch and save data from the external API', async () => {
      const mockMake: Make = {
        id: 1,
        makeId: 123,
        makeName: 'Test Make',
        vehicleTypes: generateMockVehicleTypes(),
      };
      jest.spyOn(service, 'getAllMakers').mockResolvedValue([mockMake]);
      jest.spyOn(makeRepository, 'findByMakeId').mockResolvedValue(null);

      const result = await service.syncWithExternalAPI();
      expect(result).toEqual([mockMake]);
      expect(makeRepository.findByMakeId).toHaveBeenCalledWith(123);
      expect(makeRepository.save).toHaveBeenCalledWith(mockMake);
    });
  });

  describe('getAllMakers', () => {
    it('should transform XML data to JSON and return an array of makes', async () => {
      const xmlResponse = `
        <Response>
          <Results>
            <AllVehicleMakes>
              <Make_ID>123</Make_ID>
              <Make_Name>Test Make</Make_Name>
            </AllVehicleMakes>
          </Results>
        </Response>
      `;
      httpService.get = jest.fn().mockReturnValue(of({ data: xmlResponse }));

      const result = await service.getAllMakers();
      expect(result).toEqual([
        {
          makeId: '123',
          makeName: 'Test Make',
          vehicleTypes: generateMockVehicleTypes(),
        },
      ]);
    });
  });

  describe('getVehicleTypesForMakeId', () => {
    it('should transform XML vehicle types data to JSON', async () => {
      const xmlResponse = `
        <Response>
          <Results>
            <VehicleTypesForMakeIds>
              <VehicleTypeId>1</VehicleTypeId>
              <VehicleTypeName>Sedan</VehicleTypeName>
            </VehicleTypesForMakeIds>
          </Results>
        </Response>
      `;
      httpService.get = jest.fn().mockReturnValue(of({ data: xmlResponse }));

      const result = await service.getVehicleTypesForMakeId(123);
      expect(result).toEqual([
        {
          typeId: '1',
          typeName: 'Sedan',
        },
      ]);
    });
  });

  describe('hasDataInDatabase', () => {
    it('should return true if data exists in the database', async () => {
      jest.spyOn(makeRepository, 'count').mockResolvedValue(5);
      const result = await service.hasDataInDatabase();
      expect(result).toBe(true);
    });

    it('should return false if no data exists in the database', async () => {
      jest.spyOn(makeRepository, 'count').mockResolvedValue(0);
      const result = await service.hasDataInDatabase();
      expect(result).toBe(false);
    });
  });

  describe('getVehicleByMakeId', () => {
    it('should return a Make if it exists', async () => {
      const mockMake: Make = {
        id: 1,
        makeId: 123,
        makeName: 'Test Make',
        vehicleTypes: generateMockVehicleTypes(),
      };
      jest.spyOn(makeRepository, 'findByMakeId').mockResolvedValue(mockMake);

      const result = await service.getVehicleByMakeId(123);
      expect(result).toEqual(mockMake);
    });
  });
});
