export class InvalidArgumentError extends Error {
  constructor(message?: string) {
    super(message);

    Object.setPrototypeOf(this, InvalidArgumentError.prototype);
    Error.captureStackTrace(this, this.constructor);

    this.name = InvalidArgumentError.name;
  }
}
