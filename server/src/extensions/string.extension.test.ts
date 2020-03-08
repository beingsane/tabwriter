import './string.extensions';

describe(`[${String.name} extensions]`, () => {
  describe(`[${String.prototype.indexOfDifferent.name}]`, () => {
    it('should return -1 if start index is greater than string length', () => {
      const str = 'test';
      const indexOfDifferent = str.indexOfDifferent(' ', str.length);

      expect(indexOfDifferent).toBe(-1);
    });

    it('should return -1 if iteration is 0', () => {
      const str = 'test';
      const indexOfDifferent = str.indexOfDifferent(' ', 0, 0);

      expect(indexOfDifferent).toBe(-1);
    });

    it('should return -1 if no character diferent than specified is found', () => {
      const str = 'tttt';
      const indexOfDifferent = str.indexOfDifferent('t');

      expect(indexOfDifferent).toBe(-1);
    });

    it('should return the index of the first character diferent from the one specified', () => {
      const str = 'test';
      const indexOfDifferent = str.indexOfDifferent('t');

      expect(indexOfDifferent).toBe(1);
    });
  });
});
