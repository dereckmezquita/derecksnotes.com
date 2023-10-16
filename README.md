# [derecksnotes.com](https://www.derecksnotes.com)  <img src="./.graphics/512-derecks-notes-logo.png" width="75" align="right">

Welcome to version `3.0` of [Dereck's Notes](https://www.derecksnotes.com).

<p align="center">
    <img src="./.graphics/screen-captures/site-capture-full.png" width="750">
</p>

Dereck's Notes has been reconstructed with a new and modern technical stack to integrate new features and improve maintainability. The adaptation from a static site to one that includes server-side functionalities allows the implementation of new features such as user accounts and comments.

<p align="center">
    <img src="./.graphics/screen-captures/interactive-comments.png" width="350">
    <img src="./.graphics/screen-captures/interactive-myprofile.png" width="350">
</p>

## Technical Overview

The technology stack has been modified in version `3.0` to cater to the new functionalities and to streamline the development process.

### Frontend

- **Next.js**: Adopted for its capabilities in server-side rendering, facilitating better SEO and performance.
- **TypeScript**: Employed for its static typing.
- **React**: Utilised for UI components.
- **MDX**: Chosen for content writing, combining markdown with React.
- **Styled-components**: Used for styling components.

### Backend

- **Express**: Provides a framework for web and API applications.
- **Mongoose**: Facilitates MongoDB object modelling.
- **Redis**: Manages session storage, utilising `connect-redis`.
- **Multer**: Handles file uploads (`multipart/form-data`).
- **Bcrypt**: Secures passwords by hashing them before database storage.

### Infrastructure

- **MongoDB**: Accommodates data storage needs.
- **Redis**: Manages persistent session storage.
- **Nginx**: Serves static files, manages reverse proxying, caching, and load balancing.

## New Features

### User Accounts

The implementation of user accounts facilitates personalized interactions with the site. Visitors can now create accounts, log in, and engage in more interactive features.

### Comments

With user accounts in place, visitors can contribute to the community by leaving comments on blog posts, facilitating discussions, and sharing insights.

## Interactive UI

With the use of React, the UI has been enhanced with interactive elements, such as the blog post filter, the dictionary search functionality and more!

<p align="center">
    <img src="./.graphics/screen-captures/interactive-filter-full-crop.png" width="750">
</p>

## Copyright Statement

Dereck Mezquita maintains all rights regarding the website and any code or content contained in this repository. The contents of this repository are intended solely for educational use and may not be copied or used without crediting the author.

**Contact**: contact@mezquita.io