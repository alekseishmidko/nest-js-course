import { Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserModel } from './models/user.model';
import { Authorization } from 'src/auth/decorators/authorization.decorator';

import { User, UserRole } from '../../generated/prisma/client';
import { Authorized } from '../auth/decorators/authorized.decorator';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Authorization()
  @Query(() => UserModel)
  getMe(@Authorized() user: User) {
    return user;
  }

  @Authorization(UserRole.ADMIN)
  @Query(() => [UserModel], {
    name: 'getAllUsers',
    description: 'This is best method',
  })
  async getAll() {
    return await this.userService.findAll();
  }
}
