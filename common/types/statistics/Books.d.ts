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
}
