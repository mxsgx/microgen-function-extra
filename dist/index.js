"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var mongoUrlParser = require('mongo-url-parser');
var api_1 = __importDefault(require("./routers/api"));
var helper_1 = require("./utils/helper");
module.exports = function (app) {
    var parsedMongoUrl = mongoUrlParser(process.env.MAIN_SERVICE_MONGODB);
    var mongoUrl = (0, helper_1.mongoUrlBuilder)({
        auth: parsedMongoUrl.auth,
        database: app.env.ENVIRONMENT === 'production'
            ? app.env.MONGODB_DATABASE_PROD
            : app.env.MONGODB_DATABASE_DEV,
        servers: parsedMongoUrl.servers,
        options: {
            authSource: 'admin',
        },
    });
    mongoose_1.default
        .connect(mongoUrl, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .catch(function (err) {
        console.error('[Database] Cannot connect to MongoDB server.');
        console.error('[Database]', err || err.message);
    });
    app.use('/api', api_1.default);
};
