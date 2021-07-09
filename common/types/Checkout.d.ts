import { firestore } from 'firebase-admin';
import { condition } from './Copy';

export default interface Checkout {
  book?: string | firestore.FieldValue;
  copy?: string | firestore.FieldValue;
  user?: string | firestore.FieldValue;
  checkedOutBy?: string | firestore.FieldValue;
  checkedInBy?: string | null | firestore.FieldValue;
  dueDate?: firestore.Timestamp | firestore.FieldValue | null;
  timeOut?: firestore.Timestamp | firestore.FieldValue | null;
  timeIn?: firestore.Timestamp | firestore.FieldValue | null;
  conditionOut?: condition | firestore.FieldValue;
  conditionIn?: condition | firestore.FieldValue | null;
  renewsUsed?: number | firestore.FieldValue;
  status?: checkoutStatus | firestore.FieldValue;
}

/**
 * 0: Active
 * 1: Returned
 * 2: Overdue
 * 3: Missing
 */
export type checkoutStatus = 0 | 1 | 2 | 3;
