import { PublicUser, User } from '@/interfaces/users.interface';

export function toPublicUser(user: User): PublicUser {
  const { password: _password, ...rest } = user;
  return rest as PublicUser;
}
