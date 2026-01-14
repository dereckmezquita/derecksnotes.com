# Dereck's Notes - Client

Next.js 15 frontend for [derecksnotes.com](https://www.derecksnotes.com).

## Tech Stack

- **Next.js 15**: App Router with React Server Components
- **React 19**: Latest features
- **TypeScript**: Strict mode
- **styled-components**: CSS-in-JS theming
- **MDX**: Blog posts and dictionary content

## Development

```bash
# From project root (recommended)
bun run dev

# Or client only
cd client && bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Structure

```
src/
├── app/               # App Router pages
│   ├── admin/         # Admin dashboard
│   ├── blog/          # Blog posts (MDX)
│   ├── courses/       # Course content
│   ├── dictionaries/  # Science dictionaries
│   └── profile/       # User profile
├── components/        # Reusable components
├── context/           # React context providers
├── styles/            # Theme and global styles
└── utils/             # Utility functions
```

## Features

- **MDX Content**: Blog posts and definitions
- **Comments**: Nested replies, pagination, likes/dislikes
- **User Profiles**: Comment history, analytics
- **Admin Dashboard**: User management, comment moderation, logs

## Path Aliases

Use `@/*` for imports from `src/`:

```typescript
import { api } from '@/utils/api/api';
import { useAuth } from '@/context/AuthContext';
```

See the [main README](../README.md) for full documentation.
