"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("assert/strict"));
const node_test_1 = require("node:test");
const common_1 = require("../common");
const Client_1 = __importDefault(require("../../src/Client"));
const rawRequest_1 = require("../../src/actions/rawRequest");
const fakeResponse = {
    data: { a: 1 },
    status: 200,
    headers: {}
};
(0, node_test_1.describe)('"Make Raw Request" action', async () => {
    let execRequest;
    (0, node_test_1.describe)('should succeed', async () => {
        (0, node_test_1.beforeEach)(() => {
            execRequest = node_test_1.mock.method(Client_1.default.prototype, 'apiRequest');
            execRequest.mock.mockImplementation(async () => fakeResponse);
        });
        (0, node_test_1.afterEach)(() => {
            node_test_1.mock.restoreAll();
        });
        (0, node_test_1.it)('should make POST request', async () => {
            const cfg = {};
            const msg = { body: { method: 'POST', url: '/example', data: { a: 1 } } };
            const context = (0, common_1.getContext)();
            const { body } = await rawRequest_1.processAction.call(context, msg, cfg);
            strict_1.default.strictEqual(execRequest.mock.callCount(), 1);
            strict_1.default.deepEqual(body, {
                statusCode: fakeResponse.status,
                headers: fakeResponse.headers,
                responseBody: fakeResponse.data
            });
            strict_1.default.deepEqual(execRequest.mock.calls[0].arguments[0], msg.body);
        });
    });
    (0, node_test_1.describe)('should throw error', async () => {
        (0, node_test_1.beforeEach)(() => {
        });
        (0, node_test_1.afterEach)(() => {
            node_test_1.mock.restoreAll();
        });
        (0, node_test_1.it)('StatusCodeError', async () => {
            execRequest = node_test_1.mock.method(Client_1.default.prototype, 'apiRequest');
            execRequest.mock.mockImplementation(async () => { throw new common_1.StatusCodeError(403); });
            const cfg = {};
            const msg = { body: { method: 'POST', url: '/example', body: { a: 1 } } };
            const context = (0, common_1.getContext)();
            await strict_1.default.rejects(rawRequest_1.processAction.call(context, msg, cfg), { message: 'Got error "unknown", status - "403", body: "no body found"' });
        });
        (0, node_test_1.it)('Method "DELETE" is not supported', async () => {
            const cfg = {};
            const msg = { body: { method: 'PATCH', url: '/example', body: { a: 1 } } };
            const context = (0, common_1.getContext)();
            await strict_1.default.rejects(rawRequest_1.processAction.call(context, msg, cfg), { message: 'Method "PATCH" is not supported! Supported methods are: ["DELETE","GET","POST","PUT"]' });
        });
    });
});
