"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const component_commons_library_1 = require("@elastic.io/component-commons-library");
const Client_1 = __importDefault(require("./src/Client"));
module.exports = async function verifyCredentials(cfg) {
    const client = new Client_1.default(this, cfg);
    try {
        await client.apiRequest({ method: 'GET', url: '/user' });
        this.logger.info('Verification completed successfully');
        return { verified: true };
    }
    catch (e) {
        this.logger.error('Verification failed');
        if (e.response)
            throw new Error((0, component_commons_library_1.getErrMsg)(e.response));
        throw e;
    }
};
