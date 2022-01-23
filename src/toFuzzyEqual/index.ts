import {
  printDiffOrStringify,
  printWithType,
  printReceived,
  printExpected,
  RECEIVED_COLOR,
  EXPECTED_COLOR,
} from "jest-matcher-utils";

declare global {
  namespace jest {
    interface Matchers<R> {
      /**
       * Ensures that a value matches a given string to a certain percentage. A default separator of
       * a new line (`\n`) is used to divided up both the value and expected string into sections,
       * however a different separator can be provided. Note: Sections are only matched against the
       * same corresponding location.
       *
       * @param expected the expected string
       * @param expectedPercentage the amount of sections within the strings that are expected to
       * match expressed as a percentage from 0 to 1
       * @param separator the separator to use for dividing up the strings into sections on which to
       * match
       */
      toFuzzyEqual(expected: string, expectedPercentage: number, separator?: string): R;
    }
  }
}

expect.extend({
  toFuzzyEqual(
    received: string,
    expected: string,
    expectedPercentage: number,
    separator = "\n"
  ): jest.CustomMatcherResult {
    const error = validateArgs(received, expected, expectedPercentage);
    if (error) {
      return { pass: this.isNot, message: () => error };
    }

    const receivedLines = received.split(separator);
    const expectedLines = expected.split(separator);
    const totalExpectedLines = expectedLines.length;
    let matchedLines = 0;
    for (let i = 0; i < totalExpectedLines; i++) {
      const expectedLine = expectedLines[i];
      const receivedLine = receivedLines[i];
      if (receivedLine !== undefined) {
        if (receivedLine === expectedLine) {
          matchedLines++;
        }
      }
    }

    const matchedPercentage = matchedLines / totalExpectedLines;
    const pass = matchedPercentage >= expectedPercentage;
    const message = pass
      ? () =>
          `Expected fuzzy equality of < ${expectedPercentage * 100}%;` +
          ` received ${matchedPercentage * 100}%\n\n` +
          printDiffOrStringify(expected, received, "Expected", "Received", this.expand !== false)
      : () =>
          `Expected fuzzy equality of >= ${expectedPercentage * 100}%;` +
          ` received ${matchedPercentage * 100}%\n\n` +
          printDiffOrStringify(expected, received, "Expected", "Received", this.expand !== false);

    return {
      pass,
      message,
    };
  },
});

const validateArgs = (
  received: string,
  expected: string,
  expectedPercentage: number
): string | undefined => {
  const validation: (() => string | undefined)[] = [
    validateReceived(received),
    validateExpected(expected),
    validatePercentage(expectedPercentage),
  ];

  for (const v of validation) {
    const error = v();
    if (error !== undefined) {
      return error;
    }
  }
};

const validateReceived = (received: string) => (): string | undefined => {
  if (typeof received !== "string") {
    return (
      `${RECEIVED_COLOR("received")} value must be a string\n\n` +
      printWithType("Received", received, printReceived)
    );
  }
};

const validateExpected = (expected: string) => (): string | undefined => {
  if (typeof expected !== "string") {
    return (
      `${EXPECTED_COLOR("expected")} value must be a string\n\n` +
      printWithType("Expected", expected, printExpected)
    );
  }
};

const validatePercentage = (percentage: number) => (): string | undefined => {
  if (typeof percentage !== "number") {
    return (
      `percentage value must be a number\n\n` + printWithType("Percentage", percentage, percentage)
    );
  }
  if (percentage > 1) {
    return `percentage must not be greater than 1; percentage has value: ${percentage}`;
  }
  if (percentage < 0) {
    return `percentage must not be less than 0; percentage has value: ${percentage}`;
  }
};
