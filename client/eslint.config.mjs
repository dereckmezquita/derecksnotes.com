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

/**
 * We can push additional "flat config" objects that override or disable rules.
 */
const overrides = [
    {
        files: ['**/*.{ts,tsx,js,jsx}'],
        rules: {
            // Turn off or relax the rules that are blocking your build:
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-empty-object-type': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars-experimental': 'off', // if present
            'prefer-const': 'off',
            '@typescript-eslint/ban-types': 'off', // sometimes is also triggered
            '@next/next/no-img-element': 'warn' // or 'off' if you want to allow <img>
        }
    }
];

// Combine the Next + TS config with our overrides:
const eslintConfig = [...nextAndTsConfigs, ...overrides];

export default eslintConfig;
