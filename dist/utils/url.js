"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signature = void 0;
var express_signed_url_1 = __importDefault(require("express-signed-url"));
exports.signature = (0, express_signed_url_1.default)({
    secret: process.env.JWT_SECRET,
});
