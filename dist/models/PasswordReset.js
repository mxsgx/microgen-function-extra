"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordResetSchema = void 0;
var crypto_1 = __importDefault(require("crypto"));
var mongoose_1 = __importDefault(require("mongoose"));
var Schema = mongoose_1.default.Schema;
exports.PasswordResetSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    token: {
        type: String,
        default: function () {
            return crypto_1.default.randomBytes(16).toString('hex');
        },
    },
    hash: {
        type: String,
    },
});
var PasswordReset = mongoose_1.default.model('PasswordReset', exports.PasswordResetSchema);
exports.default = PasswordReset;
