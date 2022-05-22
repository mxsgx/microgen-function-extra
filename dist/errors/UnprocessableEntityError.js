"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var HttpError_1 = __importDefault(require("./HttpError"));
var UnprocessableEntityError = /** @class */ (function (_super) {
    __extends(UnprocessableEntityError, _super);
    function UnprocessableEntityError(message) {
        if (message === void 0) { message = 'Unprocessable Entity'; }
        var _this = _super.call(this, message) || this;
        _this.name = 'UnprocessableEntityError';
        _this.statusCode = 422;
        return _this;
    }
    return UnprocessableEntityError;
}(HttpError_1.default));
exports.default = UnprocessableEntityError;
