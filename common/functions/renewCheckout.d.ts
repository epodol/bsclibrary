import { Timestamp } from 'firebase-admin/firestore';

export default interface renewCheckoutData {
  /**
   * Firestore id of the library
   */
  libraryID: string;
  /**
   * Firestore id of the checkout document.
   */
  checkoutID: string;
}

export interface renewCheckoutResult {
  /**
   * The new due date for the checkout.
   */
  dueDate: Timestamp;
}
