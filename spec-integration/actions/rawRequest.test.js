"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const strict_1 = __importDefault(require("assert/strict"));
const common_1 = require("../common");
const rawRequest_1 = require("../../src/actions/rawRequest");
(0, node_test_1.describe)('rawRequest', () => {
    (0, node_test_1.it)('should make GET request', async () => {
        const cfg = {
            secretId: process.env.ELASTICIO_SECRET_ID,
        };
        const msg = { body: { method: 'GET', url: '/assets:search?assetTypes=REPORT' } };
        const { body } = await rawRequest_1.processAction.call((0, common_1.getContext)(), msg, cfg);
        strict_1.default.strictEqual(body.statusCode, 200, `Expected status code to be 200, got ${body.statusCode}`);
        strict_1.default.ok(body.responseBody.assets, 'Expected assets in response body');
    });
});
