import { condition } from '../types/Copy';

export default interface checkoutBookData {
  /**
   * Firestore id of the library
   */
  libraryID: string;
  /**
   * Firestore id of the user
   */
  userID: string;
  /**
   * An array of the books being checked out
   */
  books: checkoutBookDataBooks[];
}

export interface checkoutBookDataBooks {
  /**
   * Firestore id of the book
   */
  bookID: string;
  /**
   * Firestore id of the copy
   */
  copyID: string;
  /**
   * Condition of the book when it was checked out
   */
  condition: condition;
  /**
   * The due date of the book's checkout
   */
  dueDate: number;
}

export interface checkoutBookResult {
  booksCheckedOut: {
    bookID: string;
    copyID: string;
    checkoutID: string;
  }[];
}
