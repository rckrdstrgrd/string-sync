import { User } from 'types/user';

const dupUser = (user: User): User => {
  const nextUser = Object.assign({}, user);
  nextUser.savedNotations = Object.assign([], user.savedNotations);
  nextUser.roles = Object.assign([], user.roles);

  return nextUser;
};

export default dupUser;
