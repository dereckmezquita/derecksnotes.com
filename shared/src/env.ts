export type BuildEnv = 'local' | 'dev' | 'prod';

export interface EnvConfig {
  domain: string;
  baseUrl: string;
  apiUrl: string;
}

export const ENV_CONFIG: Record<BuildEnv, EnvConfig> = {
  local: {
    domain: 'localhost',
    baseUrl: 'http://localhost:3000',
    apiUrl: 'http://localhost:3001/api'
  },
  dev: {
    domain: 'dev.derecksnotes.com',
    baseUrl: 'https://dev.derecksnotes.com',
    apiUrl: 'https://dev.derecksnotes.com/api'
  },
  prod: {
    domain: 'derecksnotes.com',
    baseUrl: 'https://derecksnotes.com',
    apiUrl: 'https://derecksnotes.com/api'
  }
} as const;
