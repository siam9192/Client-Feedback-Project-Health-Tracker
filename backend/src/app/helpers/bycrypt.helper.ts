import bcrypt from 'bcrypt';

function hash(data: string, round = 10) {
  return bcrypt.hashSync(data, round);
}

function compare(data: string, encrypted: string) {
  return bcrypt.compare(data, encrypted);
}

const bcryptHelper = { hash, compare };

export default bcryptHelper;
