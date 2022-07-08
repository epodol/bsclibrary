import { Timestamp } from 'firebase-admin/firestore';
import { condition } from './Copy';

/**
 * Firestore location: `/libraries/{library}/checkouts/{checkout}`
 */
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
  dueDate: Timestamp;
  /**
   * The Firestore ID of the actual time the book was checked out.
   */
  timeOut: Timestamp | null;
  /**
   * The Firestore ID of the actual time the book was checked in.
   */
  timeIn: Timestamp | null;
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
}
