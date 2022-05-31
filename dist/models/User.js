"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var Schema = mongoose_1.default.Schema;
exports.UserSchema = new Schema({
    firstName: String,
    lastName: {
        type: String,
        default: '',
    },
    email: String,
    emailVerifiedAt: {
        type: Date,
        required: false,
    },
    password: {
        type: String,
        select: false,
    },
});
var User = mongoose_1.default.model('User', exports.UserSchema);
exports.default = User;
