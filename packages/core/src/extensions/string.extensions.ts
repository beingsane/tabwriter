interface String {
  indexOfDifferent(str: string, start?: number, iteration?: number): number;
}

String.prototype.indexOfDifferent = function (
  this: string,
  char: string,
  start = 0,
  iteration = 1
): number {
  if (iteration === 0) throw Error('Iteration must be a non zero integer.');
  if (start > this.length - 1 || start < -this.length) return -1;

  const startIdx = start >= 0 ? start : this.length + start;

  const positiveIterationEndVerification: (idx: number) => boolean = (idx) =>
    idx < this.length;
  const negativeIterationEndVerification: (idx: number) => boolean = (idx) =>
    idx > 0;
  const hasEnded =
    iteration > 0
      ? positiveIterationEndVerification
      : negativeIterationEndVerification;

  for (let i = startIdx; hasEnded(i); i = i + iteration) {
    if (this[i] !== char) {
      return i;
    }
  }

  return -1;
};
