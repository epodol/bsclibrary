import { Timestamp } from 'firebase-admin/firestore';
/**
 * Firestore location: `/libraries/{library}/books/{book}/copies/{copy}`
 */
export default interface Copy {
  identifier: string;
  condition: condition;
  notes: string;
  status: status;
  libraryID: string;
  /**
   * The Firestore ID of the user who created this copy.
   */
  createdBy: string;
  /**
   * The Firestore ID of the user who last edited this copy.
   */
  updatedBy: string;
  /**
   * The Firestore Timestamp of the date and time this copy was last edited.
   */
  updatedAt: Timestamp | null;
  /**
   * The Firestore Timestamp of the date and time this copy was created.
   */
  createdAt: Timestamp | null;
}

/**
 * Condition of a copy. Description set in Library settings.
 * 1: Worst
 * 5: Best
 */
export type condition = 1 | 2 | 3 | 4 | 5;
/**
 * 0: On Shelf
 *
 * 1: In Storage
 *
 * 2: Checked Out
 *
 * 3: Missing
 *
 * 4: Not Tracked
 */
export type status = 0 | 1 | 2 | 3 | 4;
