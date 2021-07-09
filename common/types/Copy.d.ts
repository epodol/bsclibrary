import { firestore } from 'firebase-admin';

export default interface Copy {
  barcode?: string;
  condition?: condition;
  lastEdited?: firestore.Timestamp | null;
  lastEditedBy?: string;
  notes?: string;
  status?: status;
}

/**
 * 1: New
 *
 * 2: Good
 *
 * 3: Fair
 *
 * 4: Poor
 *
 * 5: Bad
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
