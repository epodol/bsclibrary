import { Timestamp } from 'firebase-admin/firestore';

/**
 * Location: /libraries/{library}/pages/{page}
 */
export default interface Page {
  /**
   * The Firestore ID of the library that this page belongs to.
   */
  libraryID: string;
  /**
   * The title of the page.
   */
  title: string;
  /**
   * The Firestore ID of the user who created this page.
   */
  createdBy: string;
  /**
   * The Firestore ID of the user who last edited this page.
   */
  updatedBy: string;
  /**
   * The Firestore Timestamp of the date and time this page was last edited.
   */
  updatedAt: Timestamp | null;
  /**
   * The Firestore Timestamp of the date and time this page was created.
   */
  createdAt: Timestamp | null;
  /**
   * Weather or not this page can be accessed without logging in and being a library member.
   */
  public: boolean;
  /**
   * The type of page this is.
   */
  type: 'text' | 'events';
  /**
   * The content of the page.
   */
  content: TextPageContent | EventsPageContent;
}

export interface TextPageContent {
  /**
   * Each section of the page.
   */
  [index: number]: {
    /**
     * The title of the section.
     */
    sectionTitle: string;
    /**
     * The content of the section in markdown format.
     */
    markdown: string;
  };
}

export interface EventsPageContent {
  /**
   * The description of the page in markdown format.
   */
  description: string;
}
