class ApplicationError {

    statusCode: number;
    message: string;
    reason: string;
    timestamp: Date;

    constructor(statusCode: number, rsn?: string) {
        this.statusCode = statusCode;
        this.message = `Unexpected error occured.`;
        this.timestamp = new Date();
        rsn ? (this.reason = rsn) : this.reason = `Unspecified reason.`;
    }


    setMessage(message: string) {
        this.message = message;
    }
}

class InternalServerError extends ApplicationError {
    constructor(reason?: string) {
        super(500, reason);
        super.setMessage(`Internal Server Error.`);
    }
}

class ResourceNotFoundError extends ApplicationError {

    constructor(reason?: string) {
        super(404, reason);
        super.setMessage('Resource not found.');
    }
}

class ResourcePersistenceError extends ApplicationError {

    constructor(reason?: string) {
        super(409, reason);
        super.setMessage('The resource was not persisted.');
    }
    
}

class BadRequestError extends ApplicationError {

    constructor(reason?: string) {
        super(400, reason);
        super.setMessage('Bad request. Invalid parameters entered.');
        
    }
}

class AuthError extends ApplicationError {
    constructor(reason?: string) {
        super(401, reason);
        super.setMessage('Authentication failed.');
    }
}

export {
    InternalServerError,
    ResourceNotFoundError,
    ResourcePersistenceError,
    BadRequestError,
    AuthError
}