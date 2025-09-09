# Environment Variables Guide for Dereck's Notes Server

This document explains how environment variables are used in the Dereck's Notes server application.

## Overview

The server uses strongly typed environment variables for configuration. All environment variables are defined in the `.env` file, with type checks enforced through TypeScript.

The environment system:
- Provides type safety for configuration values
- Automatically constructs derived values (like URLs)
- Validates that required variables are present at startup
- Enables easy configuration for different environments (local, dev, prod)

## Environment Files

- `.env` - Contains actual environment values (not committed to git)
- `.env.example` - Template for creating your own `.env` file (committed to git)

## Setup Instructions

1. Copy the `.env.example` file to create your own `.env` file:
   ```bash
   cp .env.example .env
   ```

2. Update the values in the `.env` file with your own configuration.

3. Ensure all required variables are set before starting the server.

## Core Configuration Variables

### Environment Type

```
BUILD_ENV='LOCAL'  # 'PROD' | 'DEV' | 'LOCAL'
```

This variable controls the environment context and affects how other derived values are constructed.

### Network Configuration

```
PORT_SERVER=3001  # '3001' | '3003'
PORT_CLIENT=3000  # '3000' | '3002'
DOMAIN='localhost'  # 'derecksnotes.com' | 'dev.derecksnotes.com' | 'localhost'
```

These variables define the network configuration for both server and client.

**Important**: The system generates the following derived URLs based on these values:

- If `BUILD_ENV='LOCAL'`:
  - `BASE_URL_CLIENT` = `http://localhost:3000`
  - `BASE_URL_SERVER` = `http://localhost:3001`

- If `BUILD_ENV='DEV'` or `BUILD_ENV='PROD'`:
  - `BASE_URL_CLIENT` = `https://derecksnotes.com` or `https://dev.derecksnotes.com`
  - `BASE_URL_SERVER` = `https://derecksnotes.com/api` or `https://dev.derecksnotes.com/api`

### Database Configuration

```
MONGO_URI='127.0.0.1'  # IP address or container name
MONGO_PASSWORD='your_password_here'
MONGO_DATABASE='local_derecksnotes'
```

MongoDB connection details.

### Redis Configuration

```
REDIS_URI='redis://localhost:6379'
```

Redis connection string. Note: Redis authentication is disabled - no password required.

### Security

```
SESSION_SECRET='very_secure_random_string'
```

Used for securing user sessions and cookie encryption.

### External Services

```
SENDGRID_API_KEY='your_sendgrid_api_key'
```

API keys for external service integrations.

## Technical Implementation

The environment variables system is implemented in `src/utils/env.ts` using TypeScript for type safety.

### Key Features

1. **Type Safety**: Each environment variable has a specific type:
   ```typescript
   export type TYPE_BUILD_ENV = 'PROD' | 'DEV' | 'LOCAL';
   export type TYPE_DOMAIN = 'derecksnotes.com' | 'dev.derecksnotes.com' | 'localhost';
   // etc.
   ```

2. **Validation**: The system validates that required variables exist:
   ```typescript
   function env<T = string>(name: string, parser?: (value: string) => T): T {
       const value = process.env[name];
       if (!value) {
           throw new Error(`Please define the ${name} environment variable`);
       }
       return parser ? parser(value) : (value as unknown as T);
   }
   ```

3. **Derived Values**: Some values are derived from basic configuration:
   ```typescript
   export const BASE_URL_CLIENT = BUILD_ENV === 'LOCAL'
       ? `http://${DOMAIN}:${PORT_CLIENT}`
       : `https://${DOMAIN}`;
   ```

## Common Issues

1. **Type Errors**: If you see TypeScript errors related to environment variables, ensure your `.env` values match the expected types.

2. **Missing Variables**: The server will fail to start with a clear error message if any required variables are missing.

3. **URL Construction**: If you're experiencing issues with URLs, verify that your `BUILD_ENV`, `DOMAIN`, and port values are correctly set.

## Environment Variable Reference

| Variable | Required | Type | Example | Description |
|----------|----------|------|---------|-------------|
| BUILD_ENV | Yes | 'PROD' \| 'DEV' \| 'LOCAL' | 'LOCAL' | Application environment |
| PORT_SERVER | Yes | '3001' \| '3003' | '3001' | Server port |
| PORT_CLIENT | Yes | '3000' \| '3002' | '3000' | Client port |
| DOMAIN | Yes | String | 'localhost' | Domain for URL construction |
| SESSION_SECRET | Yes | String | 'random_string' | Secret for session encryption |
| MONGO_URI | Yes | String | '127.0.0.1' | MongoDB host |
| MONGO_PASSWORD | Yes | String | 'password' | MongoDB password |
| MONGO_DATABASE | Yes | String | 'db_name' | MongoDB database name |
| REDIS_URI | Yes | String | 'redis://localhost:6379' | Redis connection string |
| SENDGRID_API_KEY | Yes | String | 'SG.xxxxx' | SendGrid API key |