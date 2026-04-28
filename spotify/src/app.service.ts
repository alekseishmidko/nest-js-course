import { Injectable } from '@nestjs/common';
import { SpotifyService } from './spotify/spotify.service';

@Injectable()
export class AppService {
  constructor(private readonly spotifyService: SpotifyService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getArtist(id: string) {
    const artist = await this.spotifyService.getArtist(id);

    return artist;
  }

  async getAlbum(id: string) {
    const album = await this.spotifyService.getAlbum(id);

    return {
      id: album.id,
      name: album.name,
      releaseDate: album.release_date,
      image: album.images[0].url,
      tracks: album.tracks.items.map((track) => ({
        id: track.id,
        name: track.name,
      })),
    };
  }
}
