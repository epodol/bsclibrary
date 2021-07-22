import { firestore } from 'firebase-admin';

export default interface renewCheckoutData {
  /**
   * Firestore id of the checkout document.
   */
  checkoutID: string;
}

export interface renewCheckoutResult {
  /**
   * The new due date for the checkout.
   */
  dueDate: firestore.Timestamp;
}
