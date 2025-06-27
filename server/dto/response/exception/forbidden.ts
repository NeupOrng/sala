export class ForbiddenException extends Error {
    statusCode = 401;
    constructor(message = "Forbidden Exception") {
        super(message);
        this.name = "ForbiddenException";
    }
}
