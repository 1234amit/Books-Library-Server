"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidUsernameOrPasswordError = exports.UnableToSaveError = void 0;
class UnableToSaveError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.UnableToSaveError = UnableToSaveError;
class InvalidUsernameOrPasswordError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.InvalidUsernameOrPasswordError = InvalidUsernameOrPasswordError;
