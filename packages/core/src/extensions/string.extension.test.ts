import './string.extensions';

describe(`[${String.name} extensions]`, () => {
  describe(`[indexOfDifferent]`, () => {
    it('should throw if iteration is 0', () => {
      const str = 'test';

      expect(() => str.indexOfDifferent(' ', 0, 0)).toThrow();
    });

    it('should return -1 if start index is greater than last character index', () => {
      const str = 'test';
      const indexOfDifferent = str.indexOfDifferent(' ', str.length);

      expect(indexOfDifferent).toBe(-1);
    });

    it('should return -1 if start index is smaller than the string length negative', () => {
      const str = 'test';
      const indexOfDifferent = str.indexOfDifferent(' ', -(str.length + 1));

      expect(indexOfDifferent).toBe(-1);
    });

    it('should return -1 if no character diferent than specified is found', () => {
      const str = 'tttt';
      const indexOfDifferent = str.indexOfDifferent('t');

      expect(indexOfDifferent).toBe(-1);
    });

    it('should return -1 if no character diferent than specified is found, while reading from last string index', () => {
      const str = 'tttt';
      const indexOfDifferent = str.indexOfDifferent('t', -1, -1);

      expect(indexOfDifferent).toBe(-1);
    });

    it('should return the index of the first character diferent from the one specified', () => {
      const str = 'test';
      const indexOfDifferent = str.indexOfDifferent('t');

      expect(indexOfDifferent).toBe(1);
    });

    it('should return the index of the first character diferent from the one specified, while reading from last string index', () => {
      const str = 'test';
      const indexOfDifferent = str.indexOfDifferent('t', -1, -1);

      expect(indexOfDifferent).toBe(2);
    });
  });
});
