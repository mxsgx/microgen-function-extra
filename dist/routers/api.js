"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var AccountController_1 = __importDefault(require("../controllers/v1/AccountController"));
var AuthController_1 = __importDefault(require("../controllers/v1/AuthController"));
var NotFoundError_1 = __importDefault(require("../errors/NotFoundError"));
var auth_1 = __importDefault(require("../middlewares/auth"));
var error_1 = __importDefault(require("../middlewares/error"));
var APIRouter = (0, express_1.Router)();
var AuthRouter = (0, express_1.Router)();
AuthRouter.post('/login', AuthController_1.default.login);
AuthRouter.post('/logout', auth_1.default, AuthController_1.default.logout);
APIRouter.use('/auth', AuthRouter);
var AccountRouter = (0, express_1.Router)();
AccountRouter.post('/register', AccountController_1.default.register);
AccountRouter.post('/forgot-password', AccountController_1.default.forgotPassword);
AccountRouter.post('/reset-password', AccountController_1.default.resetPassword);
AccountRouter.get('/profile', auth_1.default, AccountController_1.default.getProfile);
APIRouter.use('/account', AccountRouter);
APIRouter.all('*', function (req, res, next) {
    return next(new NotFoundError_1.default());
});
APIRouter.use(error_1.default);
exports.default = APIRouter;
