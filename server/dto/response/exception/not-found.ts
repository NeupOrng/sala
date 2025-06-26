export class NotFoundException extends Error {
  statusCode = 404;
  constructor(message = "Not Found") {
    super(message);
    this.name = "NotFoundException";
  }
} 