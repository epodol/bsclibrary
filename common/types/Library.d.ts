import { Timestamp } from 'firebase-admin/firestore';

/**
 * Location: `/libraries/{library}`
 */
export default interface Library {
  /**
   * The name of the library.
   */
  name: string;
  /**
   * The support email address of the library.
   */
  supportEmail: string;
  /**
   * The UID of the user who created this library.
   */
  createdBy: string;
  /**
   * The UID of the user who last edited this library.
   */
  updatedBy: string;
  /**
   * The Firestore Timestamp of the date and time this library was last edited.
   */
  updatedAt: Timestamp | null;
  /**
   * The Firestore Timestamp of the date and time this library was created.
   */
  createdAt: Timestamp | null;
  /**
   * The logos of the library.
   */
  logos: {
    /**
     * The URL of the png version of the library's logo.
     */
    png: string;
    /**
     * The URL of the jpg version of the library's logo.
     */
    jpg?: string;
    /**
     * The URL of the svg version of the library's logo.
     */
    svg?: string;
  };
  /**
   * The library's custom theme.
   */
  theme: Theme;
  /**
   * The active pages of the library used for the navigation bar.
   */
  pageGroups: [
    {
      /**
       * The index of this group.
       */
      index: number;
      /**
       * The name that will appear on the navigation bar.
       */
      name: string;
      /**
       * Weather or not this group will appear in the navigation bar to users not signed in.
       * If this is false, the public flag of the individual page will not be relevant.
       */
      public: boolean;
      /**
       * The pages in this group.
       */
      pages: [
        {
          /**
           * The index of the page within the group.
           */
          index: number;
          /**
           * The id of the page.
           */
          id: string;
          /**
           * Weather or not this page will appear in the navigation bar to users not signed in.
           */
          public: boolean;
        }
      ];
    }
  ];
  /**
   * The users who have permissions to perform actions on this library.
   */
  userPermissions: UserPermissions;
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

export interface UserPermissions {
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
}

export interface Theme {}
