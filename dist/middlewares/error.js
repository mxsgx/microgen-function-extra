"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var joi_1 = __importDefault(require("joi"));
var HttpError_1 = __importDefault(require("../errors/HttpError"));
exports.default = (function (err, req, res, next) {
    console.error("[Server] ".concat(req.method, " ").concat(req.originalUrl, ":"), err);
    if (joi_1.default.isError(err)) {
        var data_1 = {};
        err.details.forEach(function (_a) {
            var path = _a.path, message = _a.message;
            var key = path[path.length - 1].toString();
            data_1[key] = message;
        });
        return res.status(400).json({
            status: 'fail',
            data: data_1,
        });
    }
    if (err instanceof HttpError_1.default) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }
    return res.status(500).json({
        status: 'error',
        message: 'Unknown error',
    });
});
