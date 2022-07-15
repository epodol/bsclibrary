import { Timestamp } from 'firebase-admin/firestore';

/**
 * Firestore location: `/libraries/{library}/books/{book}`
 */
export default interface Book {
  /**
   * The number of copies of this book that are available in the library.
   */
  copiesAvailable: number;
  /**
   * The total number of copies of this book in the library.
   */
  copiesTotal: number;
  /**
   * Weather or not this book will appear in the library's featured books list.
   */
  featured: boolean;
  /**
   * The UID of the user who created this book.
   */
  createdBy: string;
  /**
   * The UID of the user who last edited this book.
   */
  updatedBy: string;
  /**
   * The Firestore Timestamp of the date and time this book was last edited.
   */
  updatedAt: Timestamp | null;
  /**
   * The Firestore Timestamp of the date and time this book was created.
   */
  createdAt: Timestamp | null;
  /**
   * The information about the book.
   */
  volumeInfo: volumeInfo;
}

export interface volumeInfo {
  /**
   * The array of the book's authors.
   */
  authors: string[];
  /**
   * The description of the book in markdown format.
   */
  description: string;
  /**
   * The array of the book's genres.
   */
  genres: string[];
  /**
   * The book's image URL. Null if no image is available.
   */
  image: string | null;
  /**
   * The book's ISBN-10.
   */
  isbn10: string;
  /**
   * The book's ISBN-13.
   */
  isbn13: string;
  /**
   * The book's subtitle.
   */
  subtitle: string;
  /**
   * The book's title.
   */
  title: string;
  /**
   * The call number of the book.
   */
  callNumber: string;
}
