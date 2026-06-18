import pkg from '../../../package.json';
import { ENV_CONFIG, type AppEnv } from '@derecksnotes/shared';

const APP_ENV = (process.env.NEXT_PUBLIC_APP_ENV as AppEnv) || 'local';

const derived = ENV_CONFIG[APP_ENV];

export const config = {
  version: pkg.version,
  appEnv: APP_ENV,
  isProduction: APP_ENV === 'prod',
  commitSha: process.env.NEXT_PUBLIC_COMMIT_SHA || 'local',
  domain: derived.domain,
  baseUrl: derived.baseUrl,
  apiUrl: derived.apiUrl
};
