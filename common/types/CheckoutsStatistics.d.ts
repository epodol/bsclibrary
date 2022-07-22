export interface CheckoutsStatistics {
  /**
   * The current count of active checkouts in the library.
   */
  currentCount: number;
  /**
   * The historical count of checkouts in the library.
   */
  historicalCount: number;
}

export default CheckoutsStatistics;
