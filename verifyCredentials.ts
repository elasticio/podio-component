import { getErrMsg } from '@elastic.io/component-commons-library';
import Client from './src/Client';

export = async function verifyCredentials(cfg: any) {
  const client = new Client(this, cfg);
  try {
    await client.apiRequest({ method: 'GET', url: '/user' });
    this.logger.info('Verification completed successfully');
    return { verified: true };
  } catch (e) {
    this.logger.error('Verification failed');
    if (e.response) throw new Error(getErrMsg(e.response));
    throw e;
  }
}
