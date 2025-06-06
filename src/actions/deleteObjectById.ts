import { messages } from 'elasticio-node';
import * as commons from '@elastic.io/component-commons-library';
import { deleteObjectByIdMapping } from '../utils';
import deleteByIdObjects from '../schemas/objectTypes/deleteObjectById.json';
import Client from '../Client';

let client: Client;

export async function processAction(msg: any, cfg: any) {
  this.logger.info('"Delete Object By ID" action started');

  client ||= new Client(msg, cfg);
  client.setLogger(this.logger);

  const { objectType } = cfg;
  const { idValue } = msg.body;
  if (!idValue) {
    throw new Error('No "ID Value" provided!');
  }

  let url = deleteObjectByIdMapping[objectType]?.url;
  if (!url) throw new Error(`Unsupported Object Type - ${objectType}`);

  url = url.replace('{id}', idValue);

  try {
    await client.apiRequest({ url, method: 'DELETE' });
  } catch (err) {
    if (err.response) {
      throw new Error(commons.getErrMsg(err.response));
    }
    throw err;
  }

  this.logger.info('"Delete Object By ID" action is done, emitting...');
  return messages.newMessageWithBody({ id: idValue });
}

export const getDeleteByIdObjects = async function getDeleteByIdObjects() {
  return deleteByIdObjects;
};

module.exports.process = processAction;
module.exports.getlookupByIdObjects = getDeleteByIdObjects;
