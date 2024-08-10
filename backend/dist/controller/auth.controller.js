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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.me = exports.signup = exports.login = void 0;
const http_status_codes_1 = require("http-status-codes");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const random_avatar_generator_1 = require("random-avatar-generator");
const common_1 = require("@app/common");
const model_1 = require("@app/model");
const generator = new random_avatar_generator_1.AvatarGenerator();
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const loginRequest = model_1.LoginRequestSchema.parse(req.body);
    const existingUser = yield common_1.db.user.findFirst({
        where: {
            email: loginRequest.email,
        },
    });
    if (!existingUser)
        return next({
            message: `User with email ${loginRequest.email} doesn't exists`,
            statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
        });
    const passwordMatch = yield bcrypt_1.default.compare(loginRequest.password, existingUser.password);
    if (!passwordMatch)
        return next({
            message: "The password does not match",
            statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
        });
    createJwtToken(req, res, existingUser);
});
exports.login = login;
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const signupRequest = model_1.SignupRequestSchema.parse(req.body);
    const existingUser = yield common_1.db.user.findFirst({
        where: {
            email: signupRequest.email,
        },
    });
    if (existingUser)
        return next({
            message: `User with email ${signupRequest.email} already exists`,
            statusCode: http_status_codes_1.StatusCodes.FORBIDDEN,
        });
    const avatar = generator.generateRandomAvatar(`${signupRequest.email}${signupRequest.name}`);
    const salt = yield bcrypt_1.default.genSalt(10);
    signupRequest.password = yield bcrypt_1.default.hash(signupRequest.password, salt);
    const _a = yield common_1.db.user.create({
        data: Object.assign(Object.assign({}, signupRequest), { avatar }),
    }), { id, password } = _a, newUser = __rest(_a, ["id", "password"]);
    res.status(http_status_codes_1.StatusCodes.ACCEPTED).json(newUser);
});
exports.signup = signup;
const me = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.isAuthenticated) {
        const _a = req.user, { id, password } = _a, currentUser = __rest(_a, ["id", "password"]);
        res.status(http_status_codes_1.StatusCodes.OK).json(currentUser);
    }
    else
        return (0, common_1.throwError)("Cannot fetch profile", http_status_codes_1.StatusCodes.BAD_REQUEST, next);
});
exports.me = me;
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id))
        return next({
            message: "You must be logged in",
            statusCode: http_status_codes_1.StatusCodes.UNAUTHORIZED,
        });
    const currentUser = yield common_1.db.user.findFirst({
        where: {
            id: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id,
        },
    });
    res.cookie("jwt", null, { expires: new Date(0) });
    const _c = currentUser, { id, password } = _c, user = __rest(_c, ["id", "password"]);
    res.status(http_status_codes_1.StatusCodes.OK).json(user);
});
exports.logout = logout;
const createJwtToken = (req, res, user) => {
    const payload = {
        id: user.id,
        role: user.role,
        reqIP: req.ip,
        agent: req.headers["user-agent"],
    };
    const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET || "secret", {
        expiresIn: parseInt(process.env.JWT_EXPIRE || "3600", 10),
    });
    res.cookie("jwt", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        expires: new Date(Date.now() + parseInt(process.env.JWT_EXPIRE || "60", 10) * 60 * 1000),
    });
    const { id, password } = user, loggedUser = __rest(user, ["id", "password"]);
    res.status(http_status_codes_1.StatusCodes.OK).json(loggedUser);
};
//# sourceMappingURL=auth.controller.js.map