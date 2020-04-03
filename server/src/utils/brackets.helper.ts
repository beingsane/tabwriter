export class BracketsHelper {
  private static openingClosingBracketsMap: Record<string, string> = {
    '(': ')',
    '[': ']',
    '{': '}',
  };

  public static openingBrackets: string[] = Object.keys(BracketsHelper.openingClosingBracketsMap);

  public static closingBrackets: string[] = BracketsHelper.openingBrackets.map(
    openingBracket => BracketsHelper.openingClosingBracketsMap[openingBracket],
  );

  public static isOpeningBracket(char: string): boolean {
    return BracketsHelper.openingBrackets.indexOf(char) > -1;
  }

  public static isClosingBracket(char: string): boolean {
    return BracketsHelper.closingBrackets.indexOf(char) > -1;
  }

  public static hasOpeningBracket(str: string): boolean {
    return BracketsHelper.hasBrackets(str, BracketsHelper.openingBrackets);
  }

  public static hasClosingBracket(str: string): boolean {
    return BracketsHelper.hasBrackets(str, BracketsHelper.closingBrackets);
  }

  public static indexOfMatchingClosingBracket(str: string, openingBracketIndex: number): number {
    if (openingBracketIndex > str.length - 1 || !BracketsHelper.isOpeningBracket(str[openingBracketIndex])) return -1;

    const openingBracket = str[openingBracketIndex];
    const closingBracket = BracketsHelper.openingClosingBracketsMap[openingBracket];
    const bracketsStack: string[] = [];

    for (let index = openingBracketIndex; index < str.length; index++) {
      const char = str[index];
      if (char === openingBracket) {
        bracketsStack.push(char);
      } else if (char === closingBracket) {
        bracketsStack.pop();
      }

      if (bracketsStack.length === 0) {
        return index;
      }
    }

    return -1;
  }

  private static hasBrackets(str: string, brackets: string[]): boolean {
    const bracketsIdx = brackets.map(bracket => str.indexOf(bracket)).filter(bracketIdx => bracketIdx > -1);
    const firstBracketIdx = bracketsIdx.length > 0 ? Math.min(...bracketsIdx) : -1;

    return firstBracketIdx > -1;
  }
}