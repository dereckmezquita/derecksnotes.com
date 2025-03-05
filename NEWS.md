# derecksnotes.com Change Log

## PR #35 - Environment Variable System Overhaul & Comments Refactoring (Milestone 1)

This release implements a comprehensive environment variable management system with improved type safety, automatic URL construction, and better development workflows. It also includes a complete refactoring of the comments system.

### Server Updates

#### Environment Variable System
- Implemented a type-safe environment variable system with TypeScript typings
- Created a dedicated `env<T>` utility function for type checking and validation
- Added strict type definitions for all environment variables
- Automatic URL construction based on environment type (LOCAL/DEV/PROD)
- Simplified API endpoint prefixing with environment-aware `API_PREFIX`

#### Configuration Files
- Created comprehensive `.env.example` template file with documentation
- Added `DEV.md` with detailed setup instructions and troubleshooting guide
- Standardized environment variable naming conventions

#### Code Updates
- Updated server initialization to use new environment variable system
- Improved cookie security settings based on environment
- Updated auth routes to use auto-constructed URLs for magic links and redirects
- Enhanced server status reporting with additional environment information
- Simplified route handling with consistent API prefixing

#### Developer Experience
- Improved error messages when environment variables are missing
- Added type safety to catch configuration errors at compile time
- Enhanced documentation for local development setup

### Client Updates

#### Comments System Refactoring

- **Comments System Modularization**: Refactored the comments system to avoid code duplication between the comments section and profile page.
  - Created a shared component library at `client/src/components/comments/` with:
    - `types.ts` - Common type definitions
    - `CommentStyles.tsx` - Shared styled components
    - `CommentForm.tsx`, `CommentItem.tsx`, `CommentList.tsx` - Reusable components
    - `index.ts` - Exports all components and types

- **Profile-Specific Comment Components**: Created profile-specific comment components that maintain the original profile page styling while leveraging shared types and functionality.
  - Added `client/src/components/profile/ProfileCommentItem.tsx` - Custom component with profile-specific styling
  - Added `client/src/components/profile/ProfileCommentList.tsx` - List wrapper for profile comments
  - Components maintain the original look and feel of profile comments while eliminating code duplication

#### Benefits:
- Eliminated redundant code between comments section and profile page
- Improved maintainability with consistent component structure
- Preserved the unique styling requirements for each context
- Better separation of concerns
- More extensible architecture for future features

#### Comment Timestamp Improvements
- Changed comment timestamps from relative time format ("5 minutes ago") to absolute timestamps with format YYYY-MM-DD HH:MM:SS
- For edited comments, display the last edit timestamp by default
- Added hover tooltip functionality for edited comments that shows the original creation time
- Improved user experience with custom styled tooltips
- Consistent implementation across both regular comments and profile page comments

#### User Experience Improvements
- Modified user icon in navbar to directly link to profile page when logged in
- Removed user status modal - now clicking the user icon takes logged-in users straight to their profile
- Simplified login flow: after successful login, users can access profile directly from navbar
- Auth modal automatically closes when login is successful
- Fixed TypeScript type errors for custom data attributes used in tooltips

## Coming Soon
