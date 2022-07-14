import { Timestamp } from 'firebase-admin/firestore';

export default interface JoinRequest {
  /**
   * The user who created the request.
   */
  uid: string;
  /**
   * The first name of the user who created the request.
   */
  firstName: string;
  /**
   * The last name of the user who created the request.
   */
  lastName: string;
  /**
   * The email of the user who created the request.
   */
  email: string;
  /**
   * The Firestore Timestamp of the date and time this event was last edited.
   */
  updatedAt: Timestamp | null;
  /**
   * The Firestore Timestamp of the date and time this event was created.
   */
  createdAt: Timestamp | null;
  /**
   * Weather or not the request has been approved.
   */
  approved: boolean;
}
