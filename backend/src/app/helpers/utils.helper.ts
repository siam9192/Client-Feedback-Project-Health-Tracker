import { Types } from 'mongoose';

export function objectId(id: string): Types.ObjectId {
  return new Types.ObjectId(id);
}
