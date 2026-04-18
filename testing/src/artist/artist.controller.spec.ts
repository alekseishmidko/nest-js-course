import { Test, TestingModule } from '@nestjs/testing';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { ArtistDto } from './dto/artist.dto';
import { NotFoundException } from '@nestjs/common';

const artistId = '8d7b9a51-1e6e-4d03-9f3f-e9f5d8c2b001';

const artist = {
  id: artistId,
  name: 'The Weeknd',
  genre: 'Pop',
};

const dto: ArtistDto = {
  name: 'The Weeknd',
  genre: 'Pop',
};

describe('Artist Controller', () => {
  let controller: ArtistController;
  let service: ArtistService;

  beforeEach(async () => {
    // Controller unit tests mock the service layer to verify that
    // routing methods delegate correctly and return expected data.
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArtistController],
      providers: [
        {
          provide: ArtistService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([artist]),
            findOne: jest.fn().mockResolvedValue(artist),
            create: jest.fn().mockResolvedValue(artist),
          },
        },
      ],
    }).compile();

    controller = module.get<ArtistController>(ArtistController);
    service = module.get<ArtistService>(ArtistService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an array of artists', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([artist]);
  });

  it('should return a single artist by id', async () => {
    const result = await controller.findOne(artistId);
    expect(result).toEqual(artist);
  });

  it('should throw an exception if artist not found', async () => {
    // Force the mocked service to fail once so the controller path
    // can be checked without changing the default mock behavior.
    jest
      .spyOn(service, 'findOne')
      .mockRejectedValueOnce(new NotFoundException('Artist not found'));

    try {
      await controller.findOne('non-existent-id');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('Artist not found');
    }
  });

  it('should create a new artist', async () => {
    const result = await controller.create(dto);
    expect(result).toEqual(artist);
  });
});
