"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const validateRequest = (schemaName) => {
    return (req, res, next) => {
        // TODO: Implement validation logic based on the schemaName
        next();
    };
};
exports.validateRequest = validateRequest;
