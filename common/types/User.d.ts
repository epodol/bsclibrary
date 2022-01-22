import { Timestamp } from 'firebase-admin/firestore';

/**
 * Firestore Location: `/users/{User}`
 */
export default interface User {
  userInfo: userInfo;
  checkoutInfo: checkoutInfo;
}
export interface userInfo {
  createdBy: string;
  createdTime: Timestamp | null;
  disabled: boolean;
  displayName: string;
  editedBy: string;
  editedTime: Timestamp | null;
  email: string;
  firstName: string;
  lastName: string;
  permissions: permissions;
  phoneNumber: string | null;
  photoURL: string | null;
  queryEmail: string;
  queryFirstName: string | null;
  queryLastName: string | null;
  uid: string;
}

export interface permissions {
  /**
   * View the Book Catalog. Can not make changes.
   */
  VIEW_BOOKS: string[];
  /**
   * Add public reviews to books.
   */
  REVIEW_BOOKS: string[];
  /**
   * Check in books returned to the library. This includes all books checked out by anyone.
   */
  CHECK_IN: string[];
  /**
   * Check out books from the library. This includes all books checked out by anyone.
   */
  CHECK_OUT: string[];
  /**
   * Change details about a book and its copies. Manage Reviews of a book.
   */
  MANAGE_BOOKS: string[];
  /**
   * View all current and past checkouts. Override checkout details.
   */
  MANAGE_CHECKOUTS: string[];
  /**
   * Add, edit, and disable users.
   */
  MANAGE_USERS: string[];
  /**
   * Edit properties of the library
   */
  MANAGE_LIBRARY: string[];
}

export interface checkoutInfo {
  /**
   * An array of active checkout IDs
   */
  activeCheckouts: string[];
  /**
   * The maximum number of checkouts for this user.
   *
   * This number is a recommendation, and can be exceeded.
   */
  maxCheckouts: number;
  /**
   * The maximum number of times this user can renew this book.
   *
   * This number is a limit for the user, but can be exceeded by a librarian.
   */
  maxRenews: number;
}
