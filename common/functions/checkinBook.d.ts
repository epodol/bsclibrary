import { condition, status } from '../types/Copy';

export default interface checkinBookData {
  /**
   * Firestore id of the library
   */
  libraryID: string;
  /**
   * Firestore id of the book
   */
  bookID: string;
  /**
   * Firestore id of the copy
   */
  copyID: string;
  /**
   * Condition of the book when it was checked in
   */
  condition: condition;
  /**
   * The status of the copy to set
   */
  status: status;
}

export interface checkinBookResult {
  /**
   * Firestore id of the checkout
   */
  checkoutID: string;
  /**
   * Firestore id of the user
   */
  userID: string;
  /**
   * The difference in condition between the copy when it was checked in and when it was checked out. (conditionIn - conditionOut)
   */
  conditionDiff: number;
}
