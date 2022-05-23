"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bcrypt_1 = __importDefault(require("bcrypt"));
var buffer_1 = require("buffer");
var crypto_1 = __importDefault(require("crypto"));
var joi_1 = __importDefault(require("joi"));
var jose = __importStar(require("jose"));
var UnprocessableEntityError_1 = __importDefault(require("../../errors/UnprocessableEntityError"));
var Auth_1 = __importDefault(require("../../models/Auth"));
var PasswordReset_1 = __importDefault(require("../../models/PasswordReset"));
var User_1 = __importDefault(require("../../models/User"));
var mailer_1 = require("../../utils/mailer");
var AccountController = /** @class */ (function () {
    function AccountController() {
    }
    AccountController.register = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var validator, body, user, _a, _b, auth, userObj, e_1;
            var _c;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 6, , 7]);
                        validator = joi_1.default.object({
                            firstName: joi_1.default.string().required().trim(),
                            lastName: joi_1.default.string().optional().trim(),
                            email: joi_1.default.string().email().required().trim(),
                            password: joi_1.default.string().min(8).required(),
                            passwordConfirmation: joi_1.default.ref('password'),
                        }).with('password', 'passwordConfirmation');
                        return [4 /*yield*/, validator.validateAsync(req.body)];
                    case 1:
                        body = _d.sent();
                        return [4 /*yield*/, joi_1.default.object({
                                email: joi_1.default.any().external(function (value) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, User_1.default.findOne({ email: value }).exec()];
                                            case 1:
                                                if (_a.sent()) {
                                                    throw new Error('"email" already taken.');
                                                }
                                                return [2 /*return*/];
                                        }
                                    });
                                }); }),
                            }).validateAsync({ email: body.email }, {
                                errors: {
                                    label: false,
                                },
                            })];
                    case 2:
                        _d.sent();
                        _b = (_a = User_1.default).create;
                        _c = {
                            firstName: body.firstName,
                            lastName: body.lastName,
                            email: body.email
                        };
                        return [4 /*yield*/, bcrypt_1.default.hashSync(body.password, 10)];
                    case 3: return [4 /*yield*/, _b.apply(_a, [(_c.password = _d.sent(),
                                _c)])];
                    case 4:
                        user = _d.sent();
                        return [4 /*yield*/, Auth_1.default.create({
                                user: user._id,
                                expiresIn: Date.now() + 518400000,
                            })];
                    case 5:
                        auth = _d.sent();
                        userObj = user.toObject();
                        delete userObj.password;
                        return [2 /*return*/, res.status(200).json({
                                status: 'success',
                                data: {
                                    token: auth.token,
                                    user: userObj,
                                },
                            })];
                    case 6:
                        e_1 = _d.sent();
                        return [2 /*return*/, next(e_1)];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    AccountController.forgotPassword = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var validator, body, user_1, passwordReset, secretKey, jwt, hash, e_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        validator = joi_1.default.object({
                            email: joi_1.default.string().email().required().trim(),
                        });
                        return [4 /*yield*/, validator.validateAsync(req.body)];
                    case 1:
                        body = _a.sent();
                        joi_1.default.object({
                            email: joi_1.default.any().external(function (value) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, User_1.default.findOne({ email: value }).exec()];
                                        case 1:
                                            if (!(_a.sent())) {
                                                throw new Error("We couldn't find account with this email.");
                                            }
                                            return [2 /*return*/];
                                    }
                                });
                            }); }),
                        }).validateAsync({ email: body.email }, {
                            errors: {
                                label: false,
                            },
                        });
                        return [4 /*yield*/, User_1.default.findOne({
                                email: body.email,
                            }).exec()];
                    case 2:
                        user_1 = _a.sent();
                        return [4 /*yield*/, PasswordReset_1.default.create({
                                userId: user_1._id,
                            })];
                    case 3:
                        passwordReset = _a.sent();
                        secretKey = crypto_1.default.createSecretKey(buffer_1.Buffer.from(process.env.JWT_SECRET, 'utf-8'));
                        return [4 /*yield*/, new jose.SignJWT({
                                token: passwordReset.token,
                            })
                                .setProtectedHeader({ alg: 'HS256' })
                                .setExpirationTime('1h')
                                .sign(secretKey)];
                    case 4:
                        jwt = _a.sent();
                        hash = crypto_1.default.createHash('sha256').update(jwt).digest('hex');
                        return [4 /*yield*/, passwordReset.update({
                                hash: hash,
                            })];
                    case 5:
                        _a.sent();
                        mailer_1.transporter
                            .sendMail({
                            from: 'masga@carakan.id',
                            to: user_1.email,
                            subject: 'Reset Password',
                            html: jwt,
                        })
                            .catch(function (err) {
                            console.error("[Mailer] Cannot send password reset link email to ".concat(user_1.email, "."));
                        });
                        return [2 /*return*/, res.status(200).json({
                                status: 'success',
                                data: {
                                    message: 'Password reset link email is sent.',
                                },
                            })];
                    case 6:
                        e_2 = _a.sent();
                        return [2 /*return*/, next(e_2)];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    AccountController.resetPassword = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var validator, body, secretKey, payload, passwordReset, hash, _a, _b, _c, e_3, e_4;
            var _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 9, , 10]);
                        validator = joi_1.default.object({
                            token: joi_1.default.string().required().trim(),
                            password: joi_1.default.string().required(),
                            passwordConfirmation: joi_1.default.ref('password'),
                        }).with('password', 'passwordConfirmation');
                        return [4 /*yield*/, validator.validateAsync(req.body)];
                    case 1:
                        body = _e.sent();
                        secretKey = crypto_1.default.createSecretKey(buffer_1.Buffer.from(process.env.JWT_SECRET, 'utf-8'));
                        _e.label = 2;
                    case 2:
                        _e.trys.push([2, 7, , 8]);
                        return [4 /*yield*/, jose.jwtVerify(body.token, secretKey)];
                    case 3:
                        payload = (_e.sent()).payload;
                        return [4 /*yield*/, PasswordReset_1.default.findOne({
                                token: payload.token,
                            })
                                .populate('user')
                                .exec()];
                    case 4:
                        passwordReset = _e.sent();
                        hash = crypto_1.default
                            .createHash('sha256')
                            .update(body.token)
                            .digest('hex');
                        if (hash != passwordReset.hash) {
                            throw new UnprocessableEntityError_1.default("Token hash doesn't match");
                        }
                        _b = (_a = User_1.default).updateOne;
                        _c = [{ _id: passwordReset.user._id }];
                        _d = {};
                        return [4 /*yield*/, bcrypt_1.default.hashSync(body.password, 10)];
                    case 5: return [4 /*yield*/, _b.apply(_a, _c.concat([(_d.password = _e.sent(), _d)]))];
                    case 6:
                        _e.sent();
                        return [2 /*return*/, res.status(200).json({
                                status: 'success',
                                data: {
                                    message: 'Password changed successfully.',
                                },
                            })];
                    case 7:
                        e_3 = _e.sent();
                        if (e_3 instanceof jose.errors.JWTExpired) {
                            return [2 /*return*/, next(new UnprocessableEntityError_1.default('Token is invalid'))];
                        }
                        return [2 /*return*/, next(e_3)];
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        e_4 = _e.sent();
                        return [2 /*return*/, next(e_4)];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    AccountController.getProfile = function (req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                try {
                    return [2 /*return*/, res.status(200).json({
                            status: 'success',
                            data: (_a = req.auth) === null || _a === void 0 ? void 0 : _a.user,
                        })];
                }
                catch (e) {
                    return [2 /*return*/, next(e)];
                }
                return [2 /*return*/];
            });
        });
    };
    return AccountController;
}());
exports.default = AccountController;
