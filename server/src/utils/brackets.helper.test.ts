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
