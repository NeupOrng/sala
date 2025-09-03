export interface IRequestValidatedDto {
    isError: boolean;
    message: string;
}

export class RequestValidatedDto implements IRequestValidatedDto {
    isError: boolean;
    message: string;

    constructor(info: IRequestValidatedDto) {
        this.isError = info.isError;
        this.message = info.message;
    }

    get errorNotification() {
        return {
            title: "Request Validation Error",
            description: this.message,
            type: "destructive",
            duration: 4000,
        };
    }
}
