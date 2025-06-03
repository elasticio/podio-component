import assert from 'assert/strict';
import { describe, it, beforeEach, mock, afterEach } from 'node:test';
import { getContext, StatusCodeError } from './common';
import Client from '../src/Client';
import verifyCredentials from '../verifyCredentials';

const fakeResponse: any = {
  data: { a: 1 },
  status: 200,
  headers: {}
};

describe('Verify credentials', async () => {
  let execRequest;
  describe('should succeed', async () => {
    beforeEach(() => {
      execRequest = mock.method(Client.prototype, 'apiRequest');
      execRequest.mock.mockImplementation(async () => fakeResponse);
    });
    afterEach(() => {
      mock.restoreAll();
    });
    it('Verify', async () => {
      const context = getContext();
      const cfg = {};
      const { verified } = await verifyCredentials.call(context, cfg);
      assert.strictEqual(execRequest.mock.callCount(), 1);
      assert.deepEqual(verified, true);
      assert.deepEqual(execRequest.mock.calls[0].arguments[0], { method: 'GET', url: '/user' });
    });
  });
  describe('should throw error', async () => {
    afterEach(() => {
      mock.restoreAll();
    });
    it('StatusCodeError', async () => {
      execRequest = mock.method(Client.prototype, 'apiRequest');
      execRequest.mock.mockImplementation(async () => { throw new StatusCodeError(403); });
      const cfg = {};
      const msg = { body: { method: 'POST', url: '/example', body: { a: 1 } } };
      const context = getContext();
      await assert.rejects(verifyCredentials.call(context, cfg, msg), { message: 'Got error "unknown", status - "403", body: "no body found"' });
    });
  });
});
