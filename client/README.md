# Dereck's Notes - Client

Next.js 15 frontend for [derecksnotes.com](https://www.derecksnotes.com).

## Tech Stack

- **Next.js 15**: App Router with React Server Components
- **React 19**: Latest React features
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

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Structure

```
src/
├── app/           # App Router pages
│   ├── admin/     # Admin dashboard
│   ├── blog/      # Blog posts (MDX)
│   ├── courses/   # Course content
│   ├── dictionaries/  # Science dictionaries
│   └── profile/   # User profile
├── components/    # Reusable components
│   ├── comments/  # Comments system
│   ├── ui/        # UI components (Navbar, Modal, etc.)
│   └── pages/     # Page-specific components
├── context/       # React context providers
├── styles/        # Theme and global styles
└── utils/         # Utility functions
```

## Key Features

- **MDX Content**: Blog posts and definitions written in MDX
- **Theming**: Unified theme system with HSLA colors
- **Comments**: Nested, paginated comments with likes/dislikes
- **Admin Dashboard**: User management and content moderation
- **Responsive**: Mobile-first design

See the [main README](../README.md) for full project documentation.
