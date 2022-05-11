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
    svg?: string;
  };
  theme: Theme;
  pageGroups: [
    {
      name: string;
      pages: [
        {
          id: string;
          name: string;
          description: string;
        }
      ];
    }
  ];
  userPermissions: {
    MANAGE_LIBRARY: [];
    MANAGE_PAGES: [];
    MANAGE_USERS: [];
    CHECK_OUT: [];
    CHECK_IN: [];
  };
  ownerUserID: string;
  userInfo: [
    {
      fieldName: string;
      fieldType: 'string' | 'number' | 'date' | 'boolean';
      fieldLabel: string;
      fieldPlaceholder: string;
    }
  ];
}

export interface Theme {}
