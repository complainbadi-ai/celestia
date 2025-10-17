"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = exports.authMiddleware = void 0;
const authMiddleware = (req, res, next) => {
    // TODO: Implement authentication logic
    next();
};
exports.authMiddleware = authMiddleware;
const adminMiddleware = (req, res, next) => {
    // TODO: Implement admin authentication logic
    next();
};
exports.adminMiddleware = adminMiddleware;
