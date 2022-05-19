"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var users_1 = __importDefault(require("src/controllers/v1/users"));
var auth_1 = __importDefault(require("src/middlewares/auth"));
var APIRouter = (0, express_1.Router)();
var V1 = (0, express_1.Router)();
APIRouter.use('/v1', V1);
var UsersRouter = (0, express_1.Router)();
V1.use('/users', UsersRouter);
UsersRouter.get('/me', auth_1.default, users_1.default.getMe);
exports.default = APIRouter;
