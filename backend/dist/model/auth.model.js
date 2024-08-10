"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginRequestSchema = exports.SignupRequestSchema = void 0;
const zod_1 = require("zod");
const SignupRequestSchema = zod_1.z.object({
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6), // .regex(RegexPatterns.PASSWORD),
});
exports.SignupRequestSchema = SignupRequestSchema;
const LoginRequestSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
exports.LoginRequestSchema = LoginRequestSchema;
//# sourceMappingURL=auth.model.js.map