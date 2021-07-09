import { firestore } from 'firebase-admin';

export default interface User {
  userInfo?: userInfo;
  checkoutInfo?: checkoutInfo;
}

export interface userInfo {
  createdBy?: string;
  createdTime?: firestore.Timestamp | null;
  disabled?: boolean;
  displayName?: string;
  editedBy?: string;
  editedTime?: firestore.Timestamp | null;
  email?: string;
  firstName?: string;
  lastName?: string;
  permissions?: permissions;
  phoneNumber?: string;
  photoURL?: string;
  queryEmail?: string;
  queryFirstName?: string | null;
  queryLastName?: string | null;
  role?: role;
  uid?: string;
}

export interface permissions {
  CHECK_IN?: boolean;
  CHECK_OUT?: boolean;
  MANAGE_BOOKS?: boolean;
  MANAGE_CHECKOUTS?: boolean;
  MANAGE_USERS?: boolean;
  REVIEW_BOOKS?: boolean;
  VIEW_BOOKS?: boolean;
}

export type role = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 100;

export interface checkoutInfo {
  activeCheckouts?: string[] | firestore.FieldValue;
  maxCheckouts?: number;
  maxRenews?: number;
}
