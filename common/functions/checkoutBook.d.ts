import { condition } from '../types/Copy';

export default interface checkoutBookData {
  userID: string;
  books: checkoutBookDataBooks[];
}

export interface checkoutBookDataBooks {
  bookID: string;
  copyID: string;
  condition: condition;
  dueDate: number;
}
