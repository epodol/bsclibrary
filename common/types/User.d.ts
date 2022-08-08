import { Timestamp } from 'firebase-admin/firestore';

/**
 * Firestore Location: `libraries/{Library}/users/{User}`
 */
export default interface User {
  /**
   * Whether or not the user is active within the library
   */
  active: boolean;
  /**
   * An array of active checkout IDs
   */
  activeCheckouts: string[];
  /**
   * The checkout group of the user.
   */
  checkoutGroup: string;
  /**
   * The user's first name
   */
  firstName: string;
  /**
   * The user's first name
   */
  lastName: string;
  /**
   * The user's email address
   */
  email: string;
  /**
   * The user's phone number
   */
  phoneNumber: string | null;
  /**
   * User lookup identifiers, such as Library Card numbers
   */
  identifiers: string[];
  /**
   * The day when a user's account expires, rounded down to 00:00:00 UTC
   */
  expiration: Timestamp | null;
  /**
   * The user's unique Firebase ID
   */
  uid: string;
  /**
   * The Firestore ID of the user who last edited this user.
   */
  updatedBy: string;
  /**
   * The Firestore Timestamp of the date and time this user was last edited.
   */
  updatedAt: Timestamp | null;
  /**
   * The Firestore ID of the user who approved this user.
   */
  approvedBy: string;
  /**
   * When the user was approved
   */
  approvedAt: Timestamp | null;
}
