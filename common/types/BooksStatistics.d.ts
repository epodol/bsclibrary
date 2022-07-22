export interface BooksStatistics {
  /**
   * The current count of books in the library.
   */
  currentCount: number;
  /**
   * The historical count of books in the library.
   */
  historicalCount: number;
}

export default BooksStatistics;
