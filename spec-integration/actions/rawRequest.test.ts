import { describe, it } from 'node:test';
import assert from 'assert/strict';
import { getContext } from '../common';
import { processAction } from '../../src/actions/rawRequest';

describe('rawRequest', () => {
  it('should make GET request', async () => {
    const cfg = {
      secretId: process.env.ELASTICIO_SECRET_ID,
    };
    const msg = { body: { method: 'GET', url: '/assets:search?assetTypes=REPORT' } };
    const { body } = await processAction.call(getContext(), msg, cfg);
    assert.strictEqual(body.statusCode, 200, `Expected status code to be 200, got ${body.statusCode}`);
    assert.ok(body.responseBody.assets, 'Expected assets in response body');
  });
});
