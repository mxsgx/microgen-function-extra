"use strict";
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
var joi_1 = __importDefault(require("joi"));
var NotFoundError_1 = __importDefault(require("../../errors/NotFoundError"));
var UnprocessableEntityError_1 = __importDefault(require("../../errors/UnprocessableEntityError"));
var Auth_1 = __importDefault(require("../../models/Auth"));
var User_1 = __importDefault(require("../../models/User"));
var AuthController = /** @class */ (function () {
    function AuthController() {
    }
    AuthController.login = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var validator, body, user, auth, response, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        validator = joi_1.default.object({
                            email: joi_1.default.string().email().required().trim(),
                            password: joi_1.default.string().min(8).required(),
                        });
                        return [4 /*yield*/, validator.validateAsync(req.body)];
                    case 1:
                        body = _a.sent();
                        return [4 /*yield*/, User_1.default.findOne({
                                email: body.email,
                            })
                                .select('+password')
                                .exec()];
                    case 2:
                        user = _a.sent();
                        if (!user) {
                            throw new NotFoundError_1.default('User not found.');
                        }
                        if (!bcrypt_1.default.compareSync(body.password, user.password)) {
                            throw new UnprocessableEntityError_1.default("Credentials doesn't match in our records.");
                        }
                        return [4 /*yield*/, Auth_1.default.create({
                                user: user._id,
                                expiresIn: Date.now() + 518400000, // 1 year
                            })];
                    case 3:
                        auth = _a.sent();
                        response = {
                            status: 'success',
                            data: {
                                token: auth.token,
                                user: user.toObject(),
                            },
                        };
                        return [2 /*return*/, res.status(201).json(response)];
                    case 4:
                        e_1 = _a.sent();
                        return [2 /*return*/, next(e_1)];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    AuthController.logout = function (req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var e_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Auth_1.default.deleteOne({ token: (_a = req.auth) === null || _a === void 0 ? void 0 : _a.token }).exec()];
                    case 1:
                        _b.sent();
                        return [2 /*return*/, res.status(200).json({
                                status: 'success',
                                data: null,
                            })];
                    case 2:
                        e_2 = _b.sent();
                        return [2 /*return*/, next(e_2)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return AuthController;
}());
exports.default = AuthController;
