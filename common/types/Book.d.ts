import { Timestamp } from 'firebase-admin/firestore';

export default interface Book {
  copiesAvailable: number;
  copiesCount: number;
  featured: boolean;
  lastEdited: Timestamp | null;
  lastEditedBy: string;
  volumeInfo: volumeInfo;
}

export interface volumeInfo {
  authors: string[];
  description: string;
  genres: string[];
  image: string;
  isbn10: string;
  isbn13: string;
  subtitle: string;
  title: string;
}
