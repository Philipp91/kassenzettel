import ExtendableError from "./ExtentableError";

export class AssertionError extends ExtendableError {
    public constructor(message?: string) {
        super('Assertion failed' + (message ? ': ' + message : ''));
    }
}

/**
 * Fails if condition is falsy.
 * @param condition The condition to check.
 * @param message Optional message in case the condition failed.
 * @return The value of the first argument.
 */
export default function assert<T>(condition: T, message?: string): asserts condition {
    if (!condition) {
        throw new AssertionError(message);
    }
}
