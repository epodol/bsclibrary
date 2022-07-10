import { Timestamp } from 'firebase-admin/firestore';

export interface Event {
  /**
   * The name of the event.
   */
  name: string;
  /**
   * The description of the event in markdown.
   */
  description: string;
  /**
   * The start timestamp of the event.
   */
  start: Timestamp;
  /**
   * The end timestamp of the event.
   */
  end: Timestamp;
  /**
   * The location of the event.
   */
  location: string;
  /**
   * The UIDs of users who have access to modify this event.
   */
  editors: string[];
  /**
   * Whether or not this event is public.
   */
  public: boolean;
  /**
   * The Firestore ID of the user who created this event.
   */
  createdBy: string;
  /**
   * The Firestore ID of the user who last edited this event.
   */
  updatedBy: string;
  /**
   * The Firestore Timestamp of the date and time this event was last edited.
   */
  updatedAt: Timestamp | null;
  /**
   * The Firestore Timestamp of the date and time this event was created.
   */
  createdAt: Timestamp | null;
}
