import { firestore } from 'firebase-admin';
import { condition } from './Copy';

export default interface Checkout {
  /**
   * The Firestore ID of the book being checked out
   */
  bookID?: string | firestore.FieldValue;
  /**
   * The Firestore ID of the copy being checked out
   */
  copyID?: string | firestore.FieldValue;
  /**
   * The Firestore ID of the user who owns this checkout.
   */
  userID?: string | firestore.FieldValue;
  /**
   * The Firestore ID of the user who checked out this book.
   */
  checkedOutBy?: string | firestore.FieldValue;
  /**
   * The Firestore ID of the user who checked in this book.
   */
  checkedInBy?: string | null | firestore.FieldValue;
  /**
   * A Firestore Timestamp of the date and time this book is due.
   */
  dueDate?: firestore.Timestamp | firestore.FieldValue | null;
  /**
   * The Firestore ID of the actual time the book was checked out.
   */
  timeOut?: firestore.Timestamp | firestore.FieldValue | null;
  /**
   * The Firestore ID of the actual time the book was checked in.
   */
  timeIn?: firestore.Timestamp | firestore.FieldValue | null;
  /**
   * The condition of the copy when it was checked out.
   */
  conditionOut?: condition | firestore.FieldValue;
  /**
   * The condition of the copy when it was checked in.
   */
  conditionIn?: condition | firestore.FieldValue | null;
  /**
   * The number of times that this book has been renewed.
   */
  renewsUsed?: number | firestore.FieldValue;
  /**
   * The current status of the checkout
   */
  checkoutStatus?: checkoutStatus | firestore.FieldValue;
}

/**
 * 0: Active (Normal)
 *
 * 1: Returned (Normal)
 *
 * 2: Overdue
 *
 * 3: Missing
 */
export type checkoutStatus = 0 | 1 | 2 | 3;
