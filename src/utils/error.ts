import { HttpException, HttpStatus } from '@nestjs/common';
export class ErrorHandler extends HttpException {
    constructor(message: string, statusCode: HttpStatus) {
        super(message, statusCode);
    }
}