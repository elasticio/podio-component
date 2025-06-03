import assert from 'assert/strict';
import { describe, it, beforeEach, mock, afterEach } from 'node:test';
import { getContext, StatusCodeError } from '../common';
import Client from '../../src/Client';
import { processAction } from '../../src/actions/rawRequest';

const fakeResponse: any = {
  data: { a: 1 },
  status: 200,
  headers: {}
};

describe('"Make Raw Request" action', async () => {
  let execRequest;
  describe('should succeed', async () => {
    beforeEach(() => {
      execRequest = mock.method(Client.prototype, 'apiRequest');
      execRequest.mock.mockImplementation(async () => fakeResponse);
    });
    afterEach(() => {
      mock.restoreAll();
    });
    it('should make POST request', async () => {
      const cfg = {};
      const msg = { body: { method: 'POST', url: '/example', data: { a: 1 } } };
      const context = getContext();
      const { body } = await processAction.call(context, msg, cfg);
      assert.strictEqual(execRequest.mock.callCount(), 1);
      assert.deepEqual(body, {
        statusCode: fakeResponse.status,
        headers: fakeResponse.headers,
        responseBody: fakeResponse.data
      });
      assert.deepEqual(execRequest.mock.calls[0].arguments[0], msg.body);
    });
  });
  describe('should throw error', async () => {
    beforeEach(() => {
    });
    afterEach(() => {
      mock.restoreAll();
    });
    it('StatusCodeError', async () => {
      execRequest = mock.method(Client.prototype, 'apiRequest');
      execRequest.mock.mockImplementation(async () => { throw new StatusCodeError(403); });
      const cfg = {};
      const msg = { body: { method: 'POST', url: '/example', body: { a: 1 } } };
      const context = getContext();
      await assert.rejects(processAction.call(context, msg, cfg), { message: 'Got error "unknown", status - "403", body: "no body found"' });
    });
    it('Method "DELETE" is not supported', async () => {
      const cfg = {};
      const msg = { body: { method: 'PATCH', url: '/example', body: { a: 1 } } };
      const context = getContext();
      await assert.rejects(processAction.call(context, msg, cfg), { message: 'Method "PATCH" is not supported! Supported methods are: ["DELETE","GET","POST","PUT"]' });
    });
  });
});
