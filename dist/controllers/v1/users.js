"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UsersController = /** @class */ (function () {
    function UsersController() {
    }
    UsersController.getMe = function (req, res) {
        res.json({
            data: {
                firstName: "Masga",
                lastName: "Satria Wirawan",
                email: "masga@carakan.id",
            }
        });
    };
    return UsersController;
}());
exports.default = UsersController;
