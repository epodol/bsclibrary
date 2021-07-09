import { firestore } from 'firebase-admin';

export default interface User {
  userInfo?: userInfo;
  checkoutInfo?: checkoutInfo;
}

export interface userInfo {
  createdBy?: string;
  createdTime?: firestore.Timestamp | null;
  disabled?: boolean;
  displayName?: string;
  editedBy?: string;
  editedTime?: firestore.Timestamp | null;
  email?: string;
  firstName?: string;
  lastName?: string;
  permissions?: permissions;
  phoneNumber?: string;
  photoURL?: string;
  queryEmail?: string;
  queryFirstName?: string | null;
  queryLastName?: string | null;
  role?: role;
  uid?: string;
}

/**
 * VIEW_BOOKS: View the Book Catalog. Can not make changes.
 *
 * REVIEW_BOOKS: Add public reviews to books.
 *
 * CHECK_IN: Check in books returned to the library. This includes all books checked out by anyone.
 *
 * CHECK_OUT: Check out books from the library. This includes all books checked out by anyone.
 *
 * MANAGE_BOOKS: Change details about a book and its copies. Manage Reviews of a book.
 *
 * MANAGE_CHECKOUTS: View all current and past checkouts. Override checkout details.
 *
 * MANAGE_USERS: Add, edit, and disable users.
 */
export interface permissions {
  CHECK_IN?: boolean;
  CHECK_OUT?: boolean;
  MANAGE_BOOKS?: boolean;
  MANAGE_CHECKOUTS?: boolean;
  MANAGE_USERS?: boolean;
  REVIEW_BOOKS?: boolean;
  VIEW_BOOKS?: boolean;
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
export type role = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 100;

export interface checkoutInfo {
  activeCheckouts?: string[] | firestore.FieldValue;
  maxCheckouts?: number;
  maxRenews?: number;
}
