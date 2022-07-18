import { Timestamp } from 'firebase-admin/firestore';

export interface Copies {
  /**
   * The current count of copies in the library.
   */
  currentCount: number;
  /**
   * The current count of copies in each condition in the library.
   */
  currentCountByCondition: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  /**
   * The historical count of copies in the library.
   */
  historicalCount: number;
}
