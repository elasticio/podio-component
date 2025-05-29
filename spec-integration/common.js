"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusCodeError = exports.getContext = void 0;
/* eslint-disable import/first */
const process = __importStar(require("process"));
process.env.LOG_OUTPUT_MODE = 'short';
process.env.API_RETRY_DELAY = '0';
const fs_1 = require("fs");
const dotenv_1 = require("dotenv");
const component_logger_1 = __importDefault(require("@elastic.io/component-logger"));
const node_test_1 = require("node:test");
if ((0, fs_1.existsSync)('.env')) {
    (0, dotenv_1.config)();
    const { ELASTICIO_API_URI, ELASTICIO_API_KEY, ELASTICIO_API_USERNAME, ELASTICIO_SECRET_ID, ELASTICIO_WORKSPACE_ID, } = process.env;
    if (!ELASTICIO_API_URI || !ELASTICIO_API_KEY || !ELASTICIO_API_USERNAME || !ELASTICIO_SECRET_ID || !ELASTICIO_WORKSPACE_ID) {
        throw new Error('Please, provide all environment variables');
    }
}
else {
    throw new Error('Please, provide environment variables to .env');
}
const getContext = () => ({
    logger: (0, component_logger_1.default)(),
    emit: node_test_1.mock.fn(),
});
exports.getContext = getContext;
class StatusCodeError extends Error {
    constructor(status) {
        super('');
        this.response = { status };
        this.message = 'StatusCodeError';
    }
}
exports.StatusCodeError = StatusCodeError;
