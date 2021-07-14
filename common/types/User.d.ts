import { firestore } from 'firebase-admin';

/**
 * Firestore Location: `/users/{User}`
 */
export default interface User {
  userInfo: userInfo;
  checkoutInfo: checkoutInfo;
}
export interface userInfo {
  createdBy: string;
  createdTime: firestore.Timestamp | null;
  disabled: boolean;
  displayName: string;
  editedBy: string;
  editedTime: firestore.Timestamp | null;
  email: string;
  firstName: string;
  lastName: string;
  permissions: permissions;
  phoneNumber: string | null;
  photoURL: string | null;
  queryEmail: string;
  queryFirstName: string | null;
  queryLastName: string | null;
  role: role;
  uid: string;
}

export interface permissions {
  /**
   * View the Book Catalog. Can not make changes.
   */
  VIEW_BOOKS: boolean;
  /**
   * Add public reviews to books.
   */
  REVIEW_BOOKS: boolean;
  /**
   * Check in books returned to the library. This includes all books checked out by anyone.
   */
  CHECK_IN: boolean;
  /**
   * Check out books from the library. This includes all books checked out by anyone.
   */
  CHECK_OUT: boolean;
  /**
   * Change details about a book and its copies. Manage Reviews of a book.
   */
  MANAGE_BOOKS: boolean;
  /**
   * View all current and past checkouts. Override checkout details.
   */
  MANAGE_CHECKOUTS: boolean;
  /**
   * Add, edit, and disable users.
   */
  MANAGE_USERS: boolean;
}

/**
 * 1000 Administrator: VIEW_BOOKS, REVIEW_BOOKS, CHECK_IN, CHECK_OUT, MANAGE_BOOKS, MANAGE_CHECKOUTS, MANAGE_USERS
 *
 * 900 School Administrator: VIEW_BOOKS, REVIEW_BOOKS, CHECK_IN, CHECK_OUT, MANAGE_BOOKS, MANAGE_CHECKOUTS, MANAGE_USERS
 *
 * 800 Senior Librarian: VIEW_BOOKS, REVIEW_BOOKS, CHECK_IN, CHECK_OUT, MANAGE_BOOKS, MANAGE_CHECKOUTS, MANAGE_USERS
 *
 * 700 Librarian: VIEW_BOOKS, REVIEW_BOOKS, CHECK_IN, CHECK_OUT, MANAGE_BOOKS, MANAGE_CHECKOUTS
 *
 * 600 Junior Librarian: VIEW_BOOKS, REVIEW_BOOKS, CHECK_IN, CHECK_OUT, MANAGE_BOOKS
 *
 * 500 Library Committee Member: VIEW_BOOKS, REVIEW_BOOKS, CHECK_IN, CHECK_OUT, MANAGE_BOOKS
 *
 * 400 School Staff: VIEW_BOOKS, REVIEW_BOOKS, CHECK_IN, CHECK_OUT
 *
 * 300 Teacher: VIEW_BOOKS, REVIEW_BOOKS
 *
 * 200 Parent: VIEW_BOOKS, REVIEW_BOOKS
 *
 * 100 Student: VIEW_BOOKS, REVIEW_BOOKS
 */

export type role = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 1000;

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
