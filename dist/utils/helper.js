"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoUrlBuilder = void 0;
var mongoUrlBuilder = function (config) {
    var components = [];
    if (typeof config.protocol === 'undefined') {
        components.push('mongodb');
    }
    else {
        components.push(config.protocol);
    }
    components.push('://');
    if (config.auth && config.auth.user && config.auth.password) {
        var _a = config.auth, user = _a.user, password = _a.password;
        components.push("".concat(encodeURIComponent(user), ":").concat(encodeURIComponent(password), "@"));
    }
    var servers = [];
    for (var _i = 0, _b = config.servers; _i < _b.length; _i++) {
        var server = _b[_i];
        servers.push("".concat(server.host).concat(typeof server.port === 'number' ? ":".concat(server.port) : ''));
    }
    components.push(servers.join(','));
    if (config.database) {
        components.push("/".concat(config.database));
    }
    if (config.options) {
        var options = [];
        for (var option in config.options) {
            options.push("".concat(option, "=").concat(config.options[option]));
        }
        components.push("?".concat(options.join('&')));
    }
    return components.join('');
};
exports.mongoUrlBuilder = mongoUrlBuilder;
