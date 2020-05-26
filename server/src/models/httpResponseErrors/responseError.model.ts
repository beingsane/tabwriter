export abstract class ResponseError {
  public abstract get status(): number;
  constructor(public readonly message: string) {}
}
