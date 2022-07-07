import { Timestamp } from 'firebase-admin/firestore';

/**
 * Location: `/libraries/{library}`
 */
export default interface Library {
  name: string;
  supportEmail: string;
  createdAt: Timestamp | null;
  createdBy: string;
  updatedAt: Timestamp | null;
  updatedBy: string;
  logos: {
    png: string;
    jpg?: string;
    svg?: string;
  };
  theme: Theme;
  pageGroups: [
    {
      order: number;
      name: string;
      pages: [
        {
          order: number;
          id: string;
          name: string;
          description: string;
        }
      ];
    }
  ];
  userPermissions: {
    CHECK_IN: string[];
    CHECK_OUT: string[];
    MANAGE_CHECKOUTS: string[];
    MANAGE_LIBRARY: string[];
    MANAGE_PAGES: string[];
    MANAGE_USERS: string[];
    MANAGE_BOOKS: string[];
  };
  conditionOptions: {
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
  };
  ownerUserID: string;
}

export interface Theme {}
