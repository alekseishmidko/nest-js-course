import { Test, TestingModule } from '@nestjs/testing';
import { ArtistService } from './artist.service';
import { PrismaService } from '../prisma/prisma.service';
import { ArtistDto } from './dto/artist.dto';
import { Artist } from '../../generated/prisma/client';

const artistId = '8d7b9a51-1e6e-4d03-9f3f-e9f5d8c2a001';

const artists: Artist[] = [
  { id: artistId, name: 'Billie Eilish', genre: 'Pop' },
  {
    id: '8d7b9a51-1e6e-4d03-9f3f-e9f5d8c2a002',
    name: 'The Weeknd',
    genre: 'Pop',
  },
  { id: '8d7b9a51-1e6e-4d03-9f3f-e9f5d8c2a003', name: 'Eminem', genre: 'Rap' },
];

const artist: Artist = artists[0];

const dto: ArtistDto = {
  name: artist.name,
  genre: artist.genre,
};

// Unit tests replace Prisma with a stub so service logic is checked
// without hitting a real database connection.
const db = {
  artist: {
    findMany: jest.fn().mockResolvedValue(artists),
    findUnique: jest.fn().mockResolvedValue(artist),
    create: jest.fn().mockResolvedValue(artist),
  },
};

describe('ArtistService', () => {
  let service: ArtistService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let prisma: PrismaService;

  beforeEach(async () => {
    // Nest TestingModule wires the service exactly like the app module,
    // but here PrismaService is overridden with the local mock above.
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArtistService,
        {
          provide: PrismaService,
          useValue: db,
        },
      ],
    }).compile();

    service = module.get<ArtistService>(ArtistService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of artists', async () => {
    const result = await service.findAll();
    expect(result).toEqual(artists);
  });

  it('should get a single artist by id', async () => {
    await expect(service.findOne(artistId)).resolves.toEqual(artist);
  }); //
  it('should successfully insert a new artist', async () => {
    await expect(service.create(dto)).resolves.toEqual(artist);
  });
});
