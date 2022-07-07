import { Timestamp } from 'firebase-admin/firestore';

/**
 * Firestore Location: `libraries/{Library}/users/{User}`
 */
export default interface User {
  /**
   * An array of active checkout IDs
   */
  activeCheckouts: string[];
  /**
   * When the user was approved
   */
  approvedTime: Timestamp;
  /**
   * The maximum number of checkouts the user is allowed to have
   */
  maxCheckouts: number;
  /**
   * The maximum number of renews the user is allowed to have
   */
  maxRenews: number;
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
   * User lookup identifiers, such as Library Card numbers
   */
  identifiers: string[];
  /**
   * The day when a user's account expires, rounded down to 00:00:00 America/Los_Angeles
   */
  expiration: Timestamp | null;
  /**
   * The user's unique Firebase ID
   */
  uid: string;
}
