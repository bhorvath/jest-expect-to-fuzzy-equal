declare namespace jest {
  interface Matchers<R> {
    /**
     * Used to check the equality of two strings that may not be exactly the same. The strings
     * are broken up into chunks based on a separator ('\n' by default) and compared.
     *
     * Provide a value between 0 and 1 to specify the percentage of 'sameness' to test for.
     * Optionally, specify a separator to use instead of the default.
     *
     * Note this matcher only works if both strings are of similar size and structure, as each
     * chunk is checked in the same position between strings.
     */
    toFuzzyEqual(value: string, percentage: number, separator?: string): CustomMatcherResult;
  }
}
