import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname
});

// Pull in Next.js + TypeScript recommended rules:
const nextAndTsConfigs = compat.extends(
    'next/core-web-vitals',
    'next/typescript'
);

const overrides = [
    {
        files: ['**/*.{ts,tsx,js,jsx}'],
        rules: {
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-empty-object-type': 'warn',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_'
                }
            ],
            'prefer-const': 'warn',
            '@next/next/no-img-element': 'warn'
        }
    }
];

// Combine the Next + TS config with our overrides:
const eslintConfig = [...nextAndTsConfigs, ...overrides];

export default eslintConfig;
