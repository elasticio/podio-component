import * as commons from '@elastic.io/component-commons-library';
import { messages } from 'elasticio-node';
// import { lookupObjectByIdMapping } from '../utils';
import Client from '../Client';
import lookupByIdObjects from '../schemas/objectTypes/lookupObjectById.json';

let client: Client;

export async function processAction(msg: any, cfg: any) {
  this.logger.info('"Lookup Object By ID" action started');

  client ||= new Client(this, cfg);
  client.setLogger(this.logger);

  const { objectType } = cfg;

  const { idValue } = msg.body;
  if (!idValue) {
    throw new Error('No "ID Value" provided!');
  }

  // let url = lookupObjectByIdMapping[objectType]?.url;
  // if (!url) throw new Error(`Unsupported Object Type - ${objectType}`);

  // url = url.replace('{id}', idValue);

  let result;
  try {
    // const response = await client.apiRequest({ url, method: 'GET' });
    // result = response.data;
  } catch (err) {
    if (err.response) throw new Error(commons.getErrMsg(err.response));
    throw err;
  }

  this.logger.info('"Lookup Object By ID" action is done, emitting...');
  return messages.newMessageWithBody(result);
}

export const getLookupByIdObjects = async function getLookupByIdObjects() {
  return lookupByIdObjects;
};

module.exports.process = processAction;
module.exports.getLookupByIdObjects = getLookupByIdObjects;
