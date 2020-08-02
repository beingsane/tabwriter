export class ParserResult {
  constructor(
    public value: string,
    public readFromIdx: number,
    public readToIdx: number,
    public method: string | null,
    public args: (string | number)[] | null,
    public targets: ParserResult[] | null
  ) {}
}
