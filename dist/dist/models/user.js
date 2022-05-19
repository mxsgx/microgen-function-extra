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
    lastName: String,
    email: String,
    password: String,
});
var User = mongoose_1.default.model('User', exports.UserSchema);
exports.default = User;
