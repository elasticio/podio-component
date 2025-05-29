"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusCodeError = exports.getContext = void 0;
/* eslint-disable import/first */
process.env.LOG_OUTPUT_MODE = 'short';
process.env.API_RETRY_DELAY = '0';
const component_logger_1 = __importDefault(require("@elastic.io/component-logger"));
const node_test_1 = require("node:test");
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
