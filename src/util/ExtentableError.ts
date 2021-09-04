export default class ExtendableError extends Error {
    public constructor(message?: string) {
        super(message);
        this.name = this.constructor.name;
        if (message) this.message = message;
        if (typeof Error.captureStackTrace === 'function') {
            //noinspection JSUnresolvedFunction
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(message)).stack;
        }
    }
}
