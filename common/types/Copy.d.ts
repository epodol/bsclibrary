import { Timestamp } from 'firebase-admin/firestore';

export default interface Copy {
  identifier: string;
  condition: condition;
  lastEdited: Timestamp | null;
  lastEditedBy: string;
  notes: string;
  status: status;
  libraryID: string;
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
