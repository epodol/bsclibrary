import { firestore } from 'firebase-admin';

export default interface Copy {
  barcode?: string;
  condition?: condition;
  lastEdited?: firestore.Timestamp | null;
  lastEditedBy?: string;
  notes?: string;
  status?: status;
}

export type condition = 1 | 2 | 3 | 4 | 5;
export type status = 0 | 1 | 2 | 3 | 4;
