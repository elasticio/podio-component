/* eslint-disable import/first */
import * as process from 'process';

process.env.LOG_OUTPUT_MODE = 'short';
process.env.API_RETRY_DELAY = '0';
import { existsSync } from 'fs';
import { config } from 'dotenv';

import getLogger from '@elastic.io/component-logger';
import { mock } from 'node:test';

if (existsSync('.env')) {
  config();
  const {
    ELASTICIO_API_URI,
    ELASTICIO_API_KEY,
    ELASTICIO_API_USERNAME,
    ELASTICIO_SECRET_ID,
    ELASTICIO_WORKSPACE_ID,
  } = process.env;
  if (!ELASTICIO_API_URI || !ELASTICIO_API_KEY || !ELASTICIO_API_USERNAME || !ELASTICIO_SECRET_ID || !ELASTICIO_WORKSPACE_ID) {
    throw new Error('Please, provide all environment variables');
  }
} else {
  throw new Error('Please, provide environment variables to .env');
}
export const getContext = () => ({
  logger: getLogger(),
  emit: mock.fn(),
});

export class StatusCodeError extends Error {
  response: any;

  constructor(status) {
    super('');
    this.response = { status };
    this.message = 'StatusCodeError';
  }
}
