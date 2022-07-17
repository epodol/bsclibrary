import { Timestamp } from 'firebase-admin/firestore';

export interface Checkouts {
  /**
   * The current count of active checkouts in the library.
   */
  currentCount: number;
  /**
   * The historical count of checkouts in the library.
   */
  historicalCount: number;
  /**
   * The last 1000 times a book was checked out in the library.
   */
  last1000Out: Timestamp[];
  /**
   * The last 1000 times a book was checked in in the library.
   */
  last1000In: Timestamp[];
}
