import { firestore } from 'firebase-admin';
import { condition } from './Copy';

export default interface Checkout {
  /**
   * The Firestore ID of the book being checked out
   */
  bookID: string;
  /**
   * The Firestore ID of the copy being checked out
   */
  copyID: string;
  /**
   * The Firestore ID of the user who owns this checkout.
   */
  userID: string;
  /**
   * The Firestore ID of the user who checked out this book.
   */
  checkedOutBy: string;
  /**
   * The Firestore ID of the user who checked in this book.
   */
  checkedInBy: string | null;
  /**
   * A Firestore Timestamp of the date and time this book is due.
   */
  dueDate: firestore.Timestamp | null;
  /**
   * The Firestore ID of the actual time the book was checked out.
   */
  timeOut: firestore.Timestamp | null;
  /**
   * The Firestore ID of the actual time the book was checked in.
   */
  timeIn: firestore.Timestamp | null;
  /**
   * The condition of the copy when it was checked out.
   */
  conditionOut: condition;
  /**
   * The condition of the copy when it was checked in.
   */
  conditionIn: condition | null;
  /**
   * The number of times that this book has been renewed.
   */
  renewsUsed: number;
  /**
   * The current status of the checkout
   */
  checkoutStatus: checkoutStatus;
}

/**
 * 0: Active
 *
 * 1: Returned
 *
 * 2: Returned Overdue
 *
 * 3: Missing
 */
export type checkoutStatus = 0 | 1 | 2 | 3;
