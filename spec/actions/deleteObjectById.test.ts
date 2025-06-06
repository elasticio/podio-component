import sinon from 'sinon';
import chai, { expect } from 'chai';
import { getContext, StatusCodeError } from '../common';
import Client from '../../src/Client';
import { processAction } from '../../src/actions/deleteObjectById';

const fakeResponse: any = {
  data: {},
  status: 200,
  headers: {},
};

chai.use(require('chai-as-promised'));

describe('"Delete Object by ID" action', async () => {
  let execRequest;
  describe('One contact found', async () => {
    beforeEach(() => {
      execRequest = sinon.stub(Client.prototype, 'apiRequest').callsFake(async () => fakeResponse);
    });
    afterEach(() => {
      sinon.restore();
    });
    it('should successfully delete contact', async () => {
      const cfg = {
        objectType: 'task'
      };
      const msg = {
        body: { idValue: 'abc123' },
      };
      const { body } = await processAction.call(getContext(), msg, cfg);
      expect(execRequest.callCount).to.equal(1);
      expect(body).to.deep.equal({ id: msg.body.idValue });
    });
  });
});
