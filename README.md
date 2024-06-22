# [derecksnotes.com](https://www.derecksnotes.com) <img src="./.graphics/512-derecks-notes-logo.png" width="75" align="right">

Welcome to version `4.0` of [Dereck's Notes](https://www.derecksnotes.com). Dereck's Notes has been reconstructed with a new and modern technical stack to integrate new features and improve maintainability.

It's come a long way from a bunch of static pages using `PHP` to using `webpack` for building and bundling. The adaptation from a static site to one that includes server-side functionalities allows the implementation of new features such as user accounts and comments.

Now built using `NextJS` 14 `app` dir + an `expressJS` backend.

<p align="center">
    <img src="./.graphics/screen-captures/site-capture-full.png" width="750">
</p>

<p align="center">
    <img src="./.graphics/screen-captures/interactive-comments.png" width="750">
</p>

<p align="center">
    <img src="./.graphics/screen-captures/interactive-myprofile.png" width="750">
</p>

## Technical Overview

The technology stack has been modified in version `4.0` to cater to the new functionalities and to streamline the development process.

### Frontend

-   **Next.js 14**: Using `app` dir and server side rendering features.
-   **TypeScript**: Employed for its static typing.
-   **React**: Utilised for UI components.
-   **MDX**: Chosen for content writing, combining markdown with React.
-   **Styled-components**: Used for styling components; I like to write my own `CSS` I don't like abstractions.

### Backend

-   **Express**: Provides a framework for web and API applications.
-   **Mongoose**: Facilitates MongoDB object modelling.
-   **Redis**: Manages session storage, utilising `connect-redis`.
-   **Multer**: Handles file uploads (`multipart/form-data`).
-   **Bcrypt**: Secures passwords by hashing them before database storage.

### Infrastructure

-   **MongoDB**: Accommodates data storage needs.
-   **Redis**: Manages persistent session storage.
-   **Nginx**: Serves static files, manages reverse proxying, caching, and load balancing.

### Continuous Integration/Continuous Deployment (CI/CD)

The whole is served using CI/CD pipelines on `GitHub Actions`. The pipelines are triggered in two different cases:

1. **Push to a PR**: The pipeline runs tests and linters.
    - Deploys a test version of the website to `dev.derecksnotes.com` to avoid breaking the production site.
1. **On release**: The pipeline builds the app, runs tests, and deploys the app to the server.
    - Deploys the app to `derecksnotes.com`.

This is all done in three steps:

1. **Build and push Docker image**: The app is built and pushed to docker hub.
1. **SSH copy the `docker-compose.yml` file to the server**: The `docker-compose.yml` file is copied to the server.
1. **SSH run the `docker-compose.yml` file**: The `docker-compose.yml` file is run on the server.

In order to serve the app, it is run in a `Docker` container on the network `dereck-network`. We expose port `3000` and then in a separate container we run `Nginx` which reverse proxies the app to the app via the container name `dev_derecksnotes-client` and `prod_derecksnotes-client`.

## New Features

### User Accounts

The implementation of user accounts facilitates personalized interactions with the site. Visitors can now create accounts, log in, and engage in more interactive features.

### Comments

With user accounts in place, visitors can contribute to the community by leaving comments on blog posts, facilitating discussions, and sharing insights.

## Interactive UI

With the use of React, the UI has been enhanced with interactive elements, such as the blog post filter, the dictionary search functionality and more!

<p align="center">
    <img src="./.graphics/screen-captures/interactive-filter-full.png" width="750">
</p>

## License

This project is licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0) License. See the [LICENSE](LICENSE) file for details.

