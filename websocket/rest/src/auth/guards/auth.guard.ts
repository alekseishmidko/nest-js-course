import { AuthGuard } from '@nestjs/passport';

// AuthGuard('jwt') запускает JwtStrategy, зарегистрированную под именем "jwt".
export class JwtGuard extends AuthGuard('jwt') {}
