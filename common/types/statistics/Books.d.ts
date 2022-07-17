import { Timestamp } from 'firebase-admin/firestore';

export interface Books {
  /**
   * The current count of books in the library.
   */
  currentCount: number;
  /**
   * The historical count of books in the library.
   */
  historicalCount: number;
  /**
   * The last 1000 times a book was added to the library.
   */
  last1000Added: Timestamp[];
  /**
   * The last 1000 times a book was removed to the library.
   */
  last1000Removed: Timestamp[];
}
