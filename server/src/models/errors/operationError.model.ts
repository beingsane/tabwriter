export abstract class OperationError {
  constructor(public readonly description: string) {}

  public abstract toString(): string;
}
