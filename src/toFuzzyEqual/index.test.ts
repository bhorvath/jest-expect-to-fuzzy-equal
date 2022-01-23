import "./index";

describe(".toFuzzyEqual()", () => {
  it("passes when given percentage is lower than matching percentage", () => {
    expect("aa\nbb\ncc\ndd").toFuzzyEqual("aa\nbb\naa\nbb", 0.4);
  });

  it("fails when given percentage is higher than matching percentage", () => {
    expect(() =>
      expect("aa\nbb\ncc\ndd").toFuzzyEqual("aa\nbb\naa\nbb", 0.6)
    ).toThrow();
  });

  it("passes when given percentage is equal to matching percentage", () => {
    expect("aa\nbb\ncc\ndd").toFuzzyEqual("aa\nbb\naa\nbb", 0.5);
  });

  describe(".not", () => {
    it("passes when given percentage is higher than matching percentage", () => {
      expect("aa\nbb\ncc\ndd").not.toFuzzyEqual("aa\nbb\naa\nbb", 0.6);
    });

    it("fails when given percentage is lower than matching percentage", () => {
      expect(() =>
        expect("aa\nbb\ncc\ndd").not.toFuzzyEqual("aa\nbb\naa\nbb", 0.4)
      ).toThrow();
    });

    it("fails when given percentage is equal to matching percentage", () => {
      expect(() =>
        expect("aa\nbb\ncc\ndd").not.toFuzzyEqual("aa\nbb\naa\nbb", 0.5)
      ).toThrow();
    });
  });

  it("allows a custom separator to be used", () => {
    expect("aa|bb|cc|dd").toFuzzyEqual("aa|bb|aa|bb", 0.5, "|");
  });

  describe("validation", () => {
    it("fails if received is not a string", () => {
      expect(() => expect(1).toFuzzyEqual("a", 1)).toThrow();
    });

    it("fails if expected is not a string", () => {
      expect(() => expect("a").toFuzzyEqual(1 as any, 1)).toThrow();
    });

    it("fails if percentage is not a number", () => {
      expect(() => expect("a").toFuzzyEqual("a", "b" as any)).toThrow();
    });

    it("fails if percentage is greater than 1", () => {
      expect(() => expect("a").toFuzzyEqual("a", 1.1)).toThrow();
    });

    it("fails if percentage is less than 0", () => {
      expect(() => expect("a").toFuzzyEqual("a", -1)).toThrow();
    });
  });
});
