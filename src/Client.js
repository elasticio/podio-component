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
Object.defineProperty(exports, "__esModule", { value: true });
const commons = __importStar(require("@elastic.io/component-commons-library"));
const utils_1 = require("./utils");
const MAXIMUM_4XX_ERRORS_RETRIES = 5;
const LOOKER_STUDIO_API_URL = 'https://datastudio.googleapis.com/v1';
class Client {
    constructor(context, cfg) {
        this.logger = context.logger;
        this.cfg = cfg;
        this.retries = MAXIMUM_4XX_ERRORS_RETRIES;
        this.retriesDelay = 10000;
    }
    setLogger(logger) {
        this.logger = logger;
    }
    async apiRequest(opts) {
        var _a, _b;
        if (!this.accessToken) {
            this.logger.debug('Token not found, going to fetch new one');
            await this.getNewAccessToken();
            this.logger.debug('Token created successfully');
        }
        opts = {
            ...opts,
            baseURL: LOOKER_STUDIO_API_URL,
            headers: {
                ...opts.headers || {},
                Authorization: `Bearer ${this.accessToken}`
            }
        };
        let response;
        let error;
        let currentRetry = 0;
        while (currentRetry < this.retries) {
            try {
                response = await commons.axiosReqWithRetryOnServerError.call(this, opts);
                return response;
            }
            catch (err) {
                error = err;
                if (((_a = err.response) === null || _a === void 0 ? void 0 : _a.status) === 401) {
                    this.logger.debug('Token invalid, going to fetch new one');
                    const currentToken = this.accessToken;
                    await this.getNewAccessToken();
                    if (currentToken === this.accessToken) {
                        this.logger.debug('Token not changed, going to force refresh');
                        await this.refreshAndGetNewAccessToken();
                    }
                    this.logger.debug('Trying to use new token');
                    opts.headers.Authorization = `Bearer ${this.accessToken}`;
                }
                else if (((_b = err.response) === null || _b === void 0 ? void 0 : _b.status) === 429) {
                    this.logger.error(`Going to retry after ${this.retriesDelay}ms (${currentRetry} of ${this.retries})`);
                    await commons.sleep(this.retriesDelay);
                }
                else {
                    throw err;
                }
            }
            currentRetry++;
        }
        throw error;
    }
    async getNewAccessToken() {
        let fields;
        if (this.cfg.secretId) {
            this.logger.debug('Fetching credentials by secretId');
            const response = await (0, utils_1.getSecret)(this.cfg.secretId);
            this.accessToken = response.credentials.access_token;
            fields = response.credentials.fields;
        }
        else if (this.cfg.oauth) {
            this.logger.debug('Fetching credentials from this.cfg');
            this.accessToken = this.cfg.oauth.access_token;
            fields = this.cfg;
        }
        else {
            throw new Error('Can\'t find credentials in incoming configuration');
        }
        const { retries = this.retries, retriesDelay = this.retriesDelay } = fields || {};
        if (!(0, utils_1.isNumberNaN)(retries))
            this.retries = Number(retries);
        if (!(0, utils_1.isNumberNaN)(retriesDelay))
            this.retriesDelay = Number(retriesDelay);
    }
    async refreshAndGetNewAccessToken() {
        const response = await (0, utils_1.refreshSecret)(this.cfg.secretId);
        this.accessToken = response.credentials.access_token;
    }
}
exports.default = Client;
