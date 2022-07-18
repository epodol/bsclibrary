import { Timestamp } from 'firebase-admin/firestore';

export interface Users {
  /**
   * The current count of users in the library.
   */
  currentCount: number;
  /**
   * The historical count of users in the library.
   */
  historicalCount: number;
}
