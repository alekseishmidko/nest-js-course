import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { ArtistDto } from '../src/artist/dto/artist.dto';

describe('ArtistController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    // This suite uses the full AppModule, so requests go through
    // controllers, pipes, services, and Prisma integration together.
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Reuse the same validation rules as the real app for request payloads.
    app.useGlobalPipes(new ValidationPipe());

    await app.init();

    // Prisma is retrieved from the Nest container so tests can clean up data.
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    // Remove test records to keep the database predictable between runs.
    await prisma.artist.deleteMany();
    await app.close();
  });

  const artistDto: ArtistDto = {
    name: 'Post Malone',
    genre: 'Hip-Hop',
  };

  it('POST /artists — should create artist', async () => {
    // Creation is verified from the outside via HTTP response body.
    const response = await request(app.getHttpServer())
      .post('/artists')
      .send(artistDto)
      .expect(201);

    expect(response.body).toMatchObject(artistDto);
    expect(response.body).toHaveProperty('id');
  });

  it('GET /artists — should return created artist', async () => {
    const response = await request(app.getHttpServer())
      .get('/artists')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('GET /artists/:id — should return 404 if artist not found', async () => {
    await request(app.getHttpServer())
      .get('/artists/non-existing-id')
      .expect(404);
  });

  it('GET /artists/:id — should return one artist by id', async () => {
    // First create a record, then read it back to verify the persisted state.
    const created = await request(app.getHttpServer())
      .post('/artists')
      .send(artistDto)
      .expect(201);

    const artistId = created.body.id;

    const response = await request(app.getHttpServer())
      .get(`/artists/${artistId}`)
      .expect(200);

    expect(response.body).toMatchObject({
      id: artistId,
      name: artistDto.name,
      genre: artistDto.genre,
    });
  });
});
