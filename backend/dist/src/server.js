"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
Object.defineProperty(exports, "db", { enumerable: true, get: function () { return db_1.db; } });
const app = (0, express_1.default)();
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.listen(3000, () => console.log('Server running on port 3000'));
