"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthSchema = void 0;
var crypto_1 = __importDefault(require("crypto"));
var mongoose_1 = __importDefault(require("mongoose"));
var Schema = mongoose_1.default.Schema;
exports.AuthSchema = new Schema({
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
    expiresIn: {
        type: Date,
        required: false,
    },
});
var Auth = mongoose_1.default.model('Auth', exports.AuthSchema);
exports.default = Auth;
