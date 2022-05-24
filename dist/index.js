"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var mongoUrlParser = require('mongo-url-parser');
var api_1 = __importDefault(require("./routers/api"));
var helper_1 = require("./utils/helper");
var mailer_1 = require("./utils/mailer");
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
        .then(function () {
        console.info('[Database] Connected to MongoDB server.');
    })
        .catch(function (err) {
        console.error('[Database] Cannot connect to MongoDB server.');
        console.error('[Database]', err || err.message);
    });
    mailer_1.transporter.verify(function (error, success) {
        if (error) {
            return console.error('[Mailer] Server is not ready.');
        }
        console.info('[Mailer] Server is ready to take our messages.');
    });
    console.info("[Info] Running server in ".concat(app.env.ENVIRONMENT, " environment"));
    app.use('/api/v1', api_1.default);
};
