export interface UsersStatistics {
  /**
   * The current count of users in the library.
   */
  currentCount: number;
  /**
   * The historical count of users in the library.
   */
  historicalCount: number;
}

export default UsersStatistics;
