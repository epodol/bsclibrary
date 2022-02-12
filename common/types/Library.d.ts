import { Timestamp } from 'firebase-admin/firestore';

/**
 * Location: `/libraries/{library}`
 */
export default interface Library {
  id: string;
  name: string;
  description: string;
  email: string;
  createdAt: Timestamp | null;
  createdBy: string;
  updatedAt: Timestamp | null;
  updatedBy: string;
  logos: {
    png: string;
    svg?: string;
  };
  theme: Theme;
}

export interface Theme {}
