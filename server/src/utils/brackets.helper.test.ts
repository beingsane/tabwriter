import { BracketsHelper } from './brackets.helper';

describe(`[${BracketsHelper.name}]`, () => {
  describe(`[${BracketsHelper.isOpeningBracket.name}]`, () => {
    it('should identify (, [ and { as opening brackets', () => {
      const isOpeningBracketMap: Record<string, boolean | null> = {
        '(': null,
        '[': null,
        '{': null,
      };

      Object.keys(isOpeningBracketMap).forEach(key => {
        isOpeningBracketMap[key] = BracketsHelper.isOpeningBracket(key);
      });

      expect(isOpeningBracketMap['(']).toBe(true);
      expect(isOpeningBracketMap['[']).toBe(true);
      expect(isOpeningBracketMap['{']).toBe(true);
    });
  });

  describe(`[${BracketsHelper.isClosingBracket.name}]`, () => {
    it('should identify ), ] and } as closing brackets', () => {
      const isClosingBracketMap: Record<string, boolean | null> = {
        ')': null,
        ']': null,
        '}': null,
      };

      Object.keys(isClosingBracketMap).forEach(key => {
        isClosingBracketMap[key] = BracketsHelper.isClosingBracket(key);
      });

      expect(isClosingBracketMap[')']).toBe(true);
      expect(isClosingBracketMap[']']).toBe(true);
      expect(isClosingBracketMap['}']).toBe(true);
    });
  });

  describe(`[${BracketsHelper.hasOpeningBracket.name}]`, () => {
    it('should return false when the string has no opening brackets', () => {
      const str = 'some string without opening brackets';
      const hasOpeningBrackets = BracketsHelper.hasOpeningBracket(str);

      expect(hasOpeningBrackets).toBe(false);
    });

    it('should return true if the string has one opening bracket', () => {
      const str = 'some string with a opening bracket (';
      const hasOpeningBrackets = BracketsHelper.hasOpeningBracket(str);

      expect(hasOpeningBrackets).toBe(true);
    });

    it('should return true if the string has multiple opening brackets', () => {
      const str = 'some string with a bunch of opening brackets ((( { [[[ {(';
      const hasOpeningBrackets = BracketsHelper.hasOpeningBracket(str);

      expect(hasOpeningBrackets).toBe(true);
    });
  });

  describe(`[${BracketsHelper.hasClosingBracket.name}]`, () => {
    it('should return false when the string has no closing brackets', () => {
      const str = 'some string without closing brackets';
      const hasClosingBrackets = BracketsHelper.hasClosingBracket(str);

      expect(hasClosingBrackets).toBe(false);
    });

    it('should return true if the string has one opening bracket', () => {
      const str = 'some string with a closing bracket }';
      const hasClosingBrackets = BracketsHelper.hasClosingBracket(str);

      expect(hasClosingBrackets).toBe(true);
    });

    it('should return true if the string has multiple opening brackets', () => {
      const str = 'some string with a bunch of closing brackets ]}) )}] ';
      const hasClosingBrackets = BracketsHelper.hasClosingBracket(str);

      expect(hasClosingBrackets).toBe(true);
    });
  });

  describe(`[${BracketsHelper.indexOfMatchingClosingBracket.name}]`, () => {
    it('should return -1 if opening bracket index is greater than provided string length', () => {
      const str = 'test';

      const indexOfMatchingClosingBracket = BracketsHelper.indexOfMatchingClosingBracket(str, str.length);

      expect(indexOfMatchingClosingBracket).toBe(-1);
    });

    it('should return -1 if opening brackect index does not contain a valid opening bracket', () => {
      const str = 'test';

      const indexOfMatchingClosingBracket = BracketsHelper.indexOfMatchingClosingBracket(str, 0);

      expect(indexOfMatchingClosingBracket).toBe(-1);
    });

    it('should return -1 if no matching closing bracket is found', () => {
      const str = '(test()';

      const indexOfMatchingClosingBracket = BracketsHelper.indexOfMatchingClosingBracket(str, 0);

      expect(indexOfMatchingClosingBracket).toBe(-1);
    });

    it('should return the index of the matching closing bracket if found', () => {
      const str = '(test())()';

      const indexOfMatchingClosingBracket = BracketsHelper.indexOfMatchingClosingBracket(str, 0);

      expect(indexOfMatchingClosingBracket).toBe(7);
    });
  });
});
