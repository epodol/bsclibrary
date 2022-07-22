export interface CopiesStatistics {
  /**
   * The current count of copies in the library.
   */
  currentCount: number;
  /**
   * The historical count of copies in the library.
   */
  historicalCount: number;
  /**
   * The current count of copies in each condition in the library.
   */
  currentCountByCondition: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  /**
   * The current count of copies in each status in the library.
   */
  currentCountByStatus: {
    0: number;
    1: number;
    2: number;
    3: number;
    4: number;
  };
}

export default CopiesStatistics;
