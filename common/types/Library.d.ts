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
  /**
   * The active pages of the library used for the navigation bar.
   */
  pageGroups: [
    {
      index: number;
      name: string;
      public: boolean;
      pages: [
        {
          index: number;
          id: string;
          public: boolean;
        }
      ];
    }
  ];
  /**
   * The users who have permissions to perform actions on this library.
   */
  userPermissions: {
    /**
     * UIDs of users who have permission to check in books within this library.
     */
    CHECK_IN: string[];
    /**
     * UIDs of users who have permission to check out books within this library.
     */
    CHECK_OUT: string[];
    /**
     * UIDs of users who have permission to manage the checkouts within this library.
     */
    MANAGE_CHECKOUTS: string[];
    /**
     * UIDs of users who have permission to manage the library's configuration.
     */
    MANAGE_LIBRARY: string[];
    /**
     * UIDs of users who have permission to manage the custom pages within this library.
     */
    MANAGE_PAGES: string[];
    /**
     * UIDs of users who have permission to manage the users within this library.
     */
    MANAGE_USERS: string[];
    /**
     * UIDs of users who have permission to manage the books within this library.
     */
    MANAGE_BOOKS: string[];
  };
  /**
   * The custom names of the different conditions for a book copy. 1 is the worst condition, 5 is the best condition.
   */
  conditionOptions: {
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
  };
  /**
   * The UID of the user who owns this library.
   */
  ownerUserID: string;
  /**
   * The default duration of an accounts expiration. Null means account will by default not have an expiration.
   */
  defaultExpirationDuration: number | null;
}

export interface Theme {}
