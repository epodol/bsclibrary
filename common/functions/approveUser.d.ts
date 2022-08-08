export default interface approveUserData {
  /**
   * Firestore id of the library
   */
  libraryID: string;
  /**
   * The Firebase ID of the user to approve
   */
  uid: string;
  /**
   * The user's first name
   */
  firstName: string;
  /**
   * The user's last name
   */
  lastName: string;
  /**
   * The user's email address
   */
  email: string;
  /**
   * The expiration date of the user's account
   */
  expiration: number;
}

export interface approveUserResult {
  /**
   * Firestore id of the user
   */
  userID: string;
}
