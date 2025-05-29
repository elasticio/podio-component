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
exports.processAction = void 0;
const commons = __importStar(require("@elastic.io/component-commons-library"));
const elasticio_node_1 = require("elasticio-node");
const Client_1 = __importDefault(require("../Client"));
const in_json_1 = __importDefault(require("../schemas/rawRequest/in.json"));
const allowedMethods = in_json_1.default.properties.method.enum;
let client;
async function processAction(msg, cfg) {
    this.logger.info('"Make Raw Request" action started');
    client || (client = new Client_1.default(this, cfg));
    client.setLogger(this.logger);
    const { url, method, data } = msg.body;
    if (!allowedMethods.includes(method)) {
        throw new Error(`Method "${method}" is not supported! Supported methods are: ${JSON.stringify(allowedMethods)}`);
    }
    let response;
    try {
        response = await client.apiRequest({ url, method, data });
    }
    catch (err) {
        if (err.response)
            throw new Error(commons.getErrMsg(err.response));
        throw err;
    }
    this.logger.info('request is done, emitting...');
    return elasticio_node_1.messages.newMessageWithBody({
        statusCode: response.status,
        headers: response.headers,
        responseBody: response.data
    });
}
exports.processAction = processAction;
module.exports.process = processAction;
