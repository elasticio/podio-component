import { AxiosRequestConfig, AxiosResponse } from 'axios';
import * as commons from '@elastic.io/component-commons-library';
import { getSecret, refreshSecret, isNumberNaN } from './utils';

const MAXIMUM_4XX_ERRORS_RETRIES = 5;
const LOOKER_STUDIO_API_URL = 'https://datastudio.googleapis.com/v1';

export default class Client {
  logger: any;

  cfg: any;

  accessToken: string;

  retries: number;

  retriesDelay: number;

  constructor(context, cfg) {
    this.logger = context.logger;
    this.cfg = cfg;
    this.retries = MAXIMUM_4XX_ERRORS_RETRIES;
    this.retriesDelay = 10000;
  }

  setLogger(logger) {
    this.logger = logger;
  }

  async apiRequest(opts: AxiosRequestConfig): Promise<AxiosResponse> {
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
      } catch (err) {
        error = err;
        if (err.response?.status === 401) {
          this.logger.debug('Token invalid, going to fetch new one');
          const currentToken = this.accessToken;
          await this.getNewAccessToken();
          if (currentToken === this.accessToken) {
            this.logger.debug('Token not changed, going to force refresh');
            await this.refreshAndGetNewAccessToken();
          }
          this.logger.debug('Trying to use new token');
          opts.headers.Authorization = `Bearer ${this.accessToken}`;
        } else if (err.response?.status === 429) {
          this.logger.error(`Going to retry after ${this.retriesDelay}ms (${currentRetry} of ${this.retries})`);
          await commons.sleep(this.retriesDelay);
        } else {
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
      const response = await getSecret(this.cfg.secretId);
      this.accessToken = response.credentials.access_token;
      fields = response.credentials.fields;
    } else if (this.cfg.oauth) {
      this.logger.debug('Fetching credentials from this.cfg');
      this.accessToken = this.cfg.oauth.access_token;
      fields = this.cfg;
    } else {
      throw new Error('Can\'t find credentials in incoming configuration');
    }

    const { retries = this.retries, retriesDelay = this.retriesDelay } = fields || {};

    if (!isNumberNaN(retries)) this.retries = Number(retries);
    if (!isNumberNaN(retriesDelay)) this.retriesDelay = Number(retriesDelay);
  }

  async refreshAndGetNewAccessToken() {
    const response = await refreshSecret(this.cfg.secretId);
    this.accessToken = response.credentials.access_token;
  }
}
