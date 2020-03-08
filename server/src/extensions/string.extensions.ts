interface String {
  indexOfDifferent(str: string, start?: number, iteration?: number): number;
}

String.prototype.indexOfDifferent = function(this: string, char: string, start = 0, iteration = 1): number {
  if (start > this.length - 1 || iteration === 0) return -1;

  for (let i = start; i < this.length; i = i + iteration) {
    if (this[i] !== char) {
      return i;
    }
  }

  return -1;
};
