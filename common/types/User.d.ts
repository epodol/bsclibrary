/**
 * Firestore Location: `libraries/{Library}/users/{User}`
 */
export default interface User {
  /**
   * An array of active checkout IDs
   */
  activeCheckouts: string[];
  /**
   * User information collected by the Library as defined in the Library document
   */
  userInfo: {
    [key: string]: string;
  };
  /**
   * The maximum number of checkouts the user is allowed to have
   */
  maxCheckouts: number;
  /**
   * The maximum number of renews the user is allowed to have
   */
  maxRenews: number;
}
