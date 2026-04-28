import { ConfigService } from '@nestjs/config';
import { SpotifyOptions } from 'src/spotify/interfaces/spotify-options.interface';

export function getSpotifyConfig(configService: ConfigService): SpotifyOptions {
    return {
        clientId: configService.getOrThrow<string>('SPOTIFY_CLIENT_ID'),
        clientSecret: configService.getOrThrow<string>('SPOTIFY_CLIENT_SECRET'),
    };
}
