export class BadRequestException extends Error {
  statusCode = 400;
  constructor(message = "Bad Request") {
    super(message);
    this.name = "BadRequestException";
  }
}