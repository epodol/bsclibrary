import { permissions } from '../types/User';

export default interface addNewUserData {
  email: string;
  first_name: string;
  last_name: string;
  permissions: permissions;
  maxCheckouts: number;
  maxRenews: number;
}

export interface addNewUserResult {
  uid: string;
}
