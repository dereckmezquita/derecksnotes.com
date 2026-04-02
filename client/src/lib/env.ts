import pkg from '../../../package.json';
import { ENV_CONFIG, type BuildEnv } from '@derecksnotes/shared';

const BUILD_ENV =
    (process.env.NEXT_PUBLIC_BUILD_ENV as BuildEnv) ||
    (process.env.BUILD_ENV as BuildEnv) ||
    'local';

const derived = ENV_CONFIG[BUILD_ENV];

export const config = {
    version: pkg.version,
    buildEnv: BUILD_ENV,
    isProduction: BUILD_ENV === 'prod',
    commitSha: process.env.NEXT_PUBLIC_COMMIT_SHA || 'local',
    domain: process.env.NEXT_PUBLIC_DOMAIN || derived.domain,
    baseUrl: process.env.NEXT_PUBLIC_APP_URL || derived.baseUrl,
    apiUrl: process.env.NEXT_PUBLIC_API_URL || derived.apiUrl
};
