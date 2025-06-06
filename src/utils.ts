import { axiosReqWithRetryOnServerError } from '@elastic.io/component-commons-library/dist/src/externalApi';
import { version as commonsLibraryVersion, dependencies } from '@elastic.io/component-commons-library/package.json';
import compJson from '../component.json';

const auth = {
  username: process.env.ELASTICIO_API_USERNAME,
  password: process.env.ELASTICIO_API_KEY,
};

const headers = { 'User-Agent': `podio-component/${compJson.version} component-commons-library/${commonsLibraryVersion} axios/${dependencies.axios}` };
const secretsUrl = `${process.env.ELASTICIO_API_URI}/v2/workspaces/${process.env.ELASTICIO_WORKSPACE_ID}/secrets/`;

export async function getSecret(credentialId: string) {
  const response: any = await axiosReqWithRetryOnServerError.call(this, {
    method: 'GET',
    url: `${secretsUrl}${credentialId}`,
    auth,
    headers
  });
  return response.data.data.attributes;
}

export async function refreshSecret(credentialId: string) {
  const response: any = await axiosReqWithRetryOnServerError.call(this, {
    method: 'POST',
    url: `${secretsUrl}${credentialId}/refresh`,
    auth,
    headers
  });
  return response.data.data.attributes;
}

export const isNumberNaN = (num) => Number(num).toString() === 'NaN';

export const deleteObjectByIdMapping = {
  app: {
    url: '/app/{id}',
  },
  comment: {
    url: '/comment/{id}',
  },
  file: {
    url: '/file/{id}',
  },
  flow: {
    url: '/flow/{id}',
  },
  form: {
    url: '/form/{id}',
  },
  item: {
    url: '/item/{id}',
  },
  hook: {
    url: '/hook/{id}',
  },
  integration: {
    url: '/integration/{id}',
  },
  space: {
    url: '/space/{id}',
  },
  status: {
    url: '/status/{id}',
  },
  label: {
    url: '/task/label/{id}',
  },
  task: {
    url: '/task/{id}',
  },
  view: {
    url: '/view/{id}',
  },
  voting: {
    url: '/voting/{id}',
  },
  widget: {
    url: '/widget/{id}',
  },
};

export const lookupObjectByIdMapping = {
  action: {
    url: '/action/{id}',
  },
  app: {
    url: '/app/{id}',
  },
  batch: {
    url: '/batch/{id}',
  },
  comment: {
    url: '/comment/{id}',
  },
  file: {
    url: '/file/{id}',
  },
  flow: {
    url: '/flow/{id}',
  },
  form: {
    url: '/form/{id}',
  },
  item: {
    url: '/item/{id}',
  },
  notification: {
    url: '/notification/{id}',
  },
  organization: {
    url: '/org/{id}',
  },
  task: {
    url: '/task/{id}',
  },
};
