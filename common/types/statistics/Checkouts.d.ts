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
}
