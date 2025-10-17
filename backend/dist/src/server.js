"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.db = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
Object.defineProperty(exports, "db", { enumerable: true, get: function () { return db_1.db; } });
const app = (0, express_1.default)();
exports.app = app;
app.get('/', (req, res) => {
    res.send('Hello World!');
});
let server;
if (process.env.NODE_ENV !== 'test') {
    const port = 3000;
    exports.server = server = app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}
