/**
 * Location: /libraries/{library}
 */

import { Timestamp } from 'firebase-admin/firestore';

export interface Library {
  id: string;
  name: string;
  description: string;
  email: string;
  createdAt: Timestamp | null;
  createdBy: string;
  updatedAt: Timestamp | null;
  updatedBy: string;
  logoURL: string;
  theme: Theme;
}

export interface Theme {}
