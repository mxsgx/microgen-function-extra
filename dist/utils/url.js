"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signature = void 0;
var signed = require('express-signed-url').default;
exports.signature = signed({
    secret: process.env.JWT_SECRET,
});
