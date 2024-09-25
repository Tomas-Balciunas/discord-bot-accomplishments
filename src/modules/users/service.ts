import * as schema from '@/modules/users/schema';
import UserModel from '@/modules/users/model';
import NotFound from '@/utils/errors/NotFound';

export default class UserService extends UserModel {


  async fetchUserByUsername(username: string) {
  const identifier = schema.parseUsername(username);
  const result = await this.selectUsername(identifier);

  if (!result) {
    throw new NotFound(`User by username of ${username} not found.`);
  }

  return result;
}
}
