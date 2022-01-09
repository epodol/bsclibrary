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
  grades: grades;
  image: string;
  isbn10: string;
  isbn13: string;
  subtitle: string;
  title: string;
}

export interface grades {
  grade0: boolean;
  grade1: boolean;
  grade2: boolean;
  grade3: boolean;
  grade4: boolean;
  grade5: boolean;
  grade6: boolean;
  grade7: boolean;
  grade8: boolean;
  grade9: boolean;
  grade10: boolean;
  grade11: boolean;
  grade12: boolean;
  grade13: boolean;
}
