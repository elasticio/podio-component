"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNumberNaN = exports.refreshSecret = exports.getSecret = void 0;
const externalApi_1 = require("@elastic.io/component-commons-library/dist/src/externalApi");
const package_json_1 = require("@elastic.io/component-commons-library/package.json");
const component_json_1 = __importDefault(require("../component.json"));
const auth = {
    username: process.env.ELASTICIO_API_USERNAME,
    password: process.env.ELASTICIO_API_KEY,
};
const headers = { 'User-Agent': `podio-component/${component_json_1.default.version} component-commons-library/${package_json_1.version} axios/${package_json_1.dependencies.axios}` };
const secretsUrl = `${process.env.ELASTICIO_API_URI}/v2/workspaces/${process.env.ELASTICIO_WORKSPACE_ID}/secrets/`;
async function getSecret(credentialId) {
    const response = await externalApi_1.axiosReqWithRetryOnServerError.call(this, {
        method: 'GET',
        url: `${secretsUrl}${credentialId}`,
        auth,
        headers
    });
    return response.data.data.attributes;
}
exports.getSecret = getSecret;
async function refreshSecret(credentialId) {
    const response = await externalApi_1.axiosReqWithRetryOnServerError.call(this, {
        method: 'POST',
        url: `${secretsUrl}${credentialId}/refresh`,
        auth,
        headers
    });
    return response.data.data.attributes;
}
exports.refreshSecret = refreshSecret;
const isNumberNaN = (num) => Number(num).toString() === 'NaN';
exports.isNumberNaN = isNumberNaN;
