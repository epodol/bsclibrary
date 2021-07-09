import { firestore } from 'firebase-admin';
import { condition } from '../types/Copy';

export default interface checkoutBookData {
  userID: string;
  books: checkoutBookDataBooks[];
}

export interface checkoutBookDataBooks {
  bookID: string;
  copyID: string;
  condition: condition;
  dueDate: firestore.Timestamp;
}

export interface checkoutBookResult {
  books: checkoutBookResultBooks[];
}

export interface checkoutBookResultBooks {
  bookID: string;
  copyID: string;
  checkoutID?: string;
}
