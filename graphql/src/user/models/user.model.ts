import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

import { BaseModel } from 'src/common/models/base.model';
import { User, UserRole } from '../../../generated/prisma/client';

registerEnumType(UserRole, {
  name: 'UserRole',
});

@ObjectType({
  description: 'Модель пользователя',
})
export class UserModel extends BaseModel implements User {
  @Field(() => String, {
    nullable: true,
    defaultValue: 'John',
    description: 'Имя пользователя',
  })
  name: string;

  @Field(() => String, {
    nullable: false,
    description: 'Почта пользователя',
  })
  email: string;

  @Field(() => String, {
    nullable: false,
    description: 'Пароль пользователя',
  })
  password: string;

  @Field(() => UserRole, {
    nullable: false,
    description: 'Роль пользователя',
  })
  role: UserRole;
}
