I have a website I built. When I built it I was not very knowledgable and now feel I could re-work it. Specifically I want to re-write it using ReactJS framework.

I want to create a prompt which we could use to explain this problem. For starters here's the readme to my website:

```md
# [derecksnotes.com](https://www.derecksnotes.com)  <img src="./.graphics/512-derecks-notes-logo.png" width="75" align="right">

Version `2.0` of my website: [`www.derecksnotes.com`](https://www.derecksnotes.com).

<p align="center">
    <img src="./.graphics/screen-captures/site-capture-full.png" width="750">
</p>

This website features progressive web-app technologies and thus can prompt a user and then be installed locally on a mobile phone for offline use.

<p align="center">
    <img src="./.graphics/screen-captures/site-capture-mobile-install-prompt.jpeg" width="350">
    <img src="./.graphics/screen-captures/site-capture-installed.jpeg" width="350">
</p>

# Tech stack

This website is a full stack project both back end and front end; is built on the following technologies:

- `webpack` for module bundling; used to manage and build:
    - `TypeScript` to `JavaScript`.
    - `ejs` to `html`.
    - `scss` to `css`.
- `TypeScript` used for server side and front end code.
- `scss` used for front end styles.
- `mongodb` used as a database for:
    - blog/post entries.
    - User accounts.
    - User comments.
    - Dictionary definitions.
- `express` for handling client side requests.
    - `redis` for persistent session storage.
- `nginx` for serving static files, reverse proxying database requests, caching, load balancing and more.


# Copyright

I reserve all rights for this website, and any code or content found in this repository. You may not copy this code or content. This is to serve only as an educational resource, and any use or reference of/to the content herein must be credited to the author: Dereck de Mezquita. 

Contact: contact@demezquita.com
```

---------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------

I can tell you some more about the website; for example here is the folder structure:

```bash
.
./TODO.md
./package.json
./server
./server/tsconfig.json
./server/dist
./server/dist/server
./server/dist/shared
./server/dist/modules
./server/dist/routes.js
./server/dist/routes
./server/dist/index.js
./server/src
./server/src/types
./server/src/routes.ts
./server/src/modules
./server/src/index.ts
./server/src/routes
./server/test
./server/test/modules
./server/test/routes.js
./server/test/routes
./server/test/index.js
./shared
./shared/types
./shared/types/index.d.ts
./package-lock.json
./node_modules
./client
./client/tsconfig.json
./client/public
./client/public/css
./client/public/account.html
./client/public/manifest.json
./client/public/art.html
./client/public/exercises
./client/public/tools
./client/public/references.html
./client/public/tools.html
./client/public/index.html
./client/public/courses
./client/public/js
./client/public/references
./client/public/courses.html
./client/public/dictionaries
./client/public/fonts
./client/public/favicon.ico
./client/public/blog
./client/public/exercises.html
./client/public/site-images
./client/public/art
./client/webpack.config.ts
./client/src
./client/src/exercises.ejs
./client/src/manifest.json
./client/src/exercises
./client/src/tools
./client/src/tools.ejs
./client/src/account.ejs
./client/src/courses
./client/src/templates
./client/src/ts
./client/src/art.ejs
./client/src/scss
./client/src/references
./client/src/index.ejs
./client/src/dictionaries
./client/src/fonts
./client/src/favicon.ico
./client/src/references.ejs
./client/src/blog
./client/src/courses.ejs
./client/src/site-images
./client/src/art
./client/test
./client/test/css
./client/test/account.html
./client/test/manifest.json
./client/test/art.html
./client/test/exercises
./client/test/tools
./client/test/references.html
./client/test/tools.html
./client/test/index.html
./client/test/courses
./client/test/js
./client/test/references
./client/test/courses.html
./client/test/dictionaries
./client/test/fonts
./client/test/favicon.ico
./client/test/blog
./client/test/exercises.html
./client/test/site-images
./client/test/art
./client/helpers
./client/helpers/plugins.ts
./client/helpers/sections.ts
./README.md
./deprecated
./conf
./conf/redis.conf
./conf/derecksnotes-server.service
./conf/test-derecksnotes-server.service
./conf/nginx.conf
```

-------
You are an AI assistant, you will be working together with Dereck to rewrite his full-stack web application built with TypeScript, webpack, EJS, SCSS, and MongoDB. Together, you will be working to rewrite the front-end using the ReactJS framework while keeping the back-end mostly unchanged. As the original author of the website, he has knowledge of the existing codebase and can provide context and information as needed. Feel free to ask him questions about the codebase and how it works.

The current project structure consists of two main directories: "client" and "server". The "client" directory contains the front-end code, including EJS templates, SCSS stylesheets, and static assets like images and fonts. The "server" directory contains the back-end code, including modules, routes, and tests. Additionally, your webpack.config.ts file currently bundles your TypeScript and SCSS code and includes various plugins to generate HTML and CSS files.

Where do we start?

This website is a full stack project both back end and front end; is built on the following technologies:

- `webpack` for module bundling; used to manage and build:
    - `TypeScript` to `JavaScript`.
    - `ejs` to `html`.
    - `scss` to `css`.
- `TypeScript` used for server side and front end code.
- `scss` used for front end styles.
- `mongodb` used as a database for:
    - blog/post entries.
    - User accounts.
    - User comments.
    - Dictionary definitions.
- `express` for handling client side requests.
    - `redis` for persistent session storage.
- `nginx` for serving static files, reverse proxying database requests, caching, load balancing and more.

----------
<!-- CHATGPT: -->
Great! To rewrite the front-end using ReactJS, we'll follow these steps:

Set up a new React app.
Reorganize the project structure.
Migrate EJS templates to React components.
Migrate SCSS styles to CSS modules or styled-components.
Update webpack configuration to handle React code.
Refactor the server-side code to serve the new React app.
Let's begin with setting up a new React app.

Set up a new React app:
You can use create-react-app or set it up manually. If you prefer the first option, make sure to have create-react-app installed globally:

bash
Copy code
npm install -g create-react-app
Then, in your project's root directory, create a new React app:

bash
Copy code
create-react-app client --template typescript
This will create a new React app inside the client folder with TypeScript support.

If you prefer to set it up manually, you can follow the official React TypeScript guide.

Reorganize the project structure:
Move the current client folder's content to a new folder called client-old. This will allow us to reference the old code while working on the new React app. After that, move the newly created React app inside the client folder.

Migrate EJS templates to React components:
Analyze the existing EJS templates and recreate them as React components. Break down the templates into smaller, reusable components. Since you're working with Dereck, ask for his input on how to best structure the components.

Migrate SCSS styles to CSS modules or styled-components:
You have two main options for handling styles in a React app: CSS modules and styled-components. You can choose one based on your preference or Dereck's input. If you choose CSS modules, rename .scss files to .module.scss and import them in the corresponding React components. If you choose styled-components, install the necessary packages and refactor the styles using the library's syntax.

Update webpack configuration to handle React code:
Since create-react-app comes with its own webpack configuration, you don't need to worry about this step if you used it. If you set up the React app manually, update your webpack.config.ts to include the necessary loaders and plugins for handling React and TypeScript code.

Refactor the server-side code to serve the new React app:
Modify the server-side code to serve the new React app's index.html file as the entry point for all routes, allowing client-side routing to take over. Update the Express static middleware to serve the new client/build folder.

Once you complete these steps, test the new React app and ensure it works as expected. If you encounter any issues, work with Dereck to resolve them.
----------

Please note I am Dereck, you are working with me - we are two entities working on this project: Dereck and you ChatGPT the AI assistant. My role is to brain storm with you provide information and then implement the changes we come up with. Your role is to act as the teacher (since you know React) and guide me through this process. I want you to be as verbose as possible and hand holdy as possible.

What should I do next? I read your other points but they are too vague and I don't understand what to do.

Up to this point I've done this:

1. I've installed React and created a new React app. I moved the old code to `client-old`; it looks like this:

```
dereck@localhost:/html/derecksnotes.com$ ls client-old/
helpers  public  src  test  tsconfig.json  webpack.config.ts
dereck@localhost:/html/derecksnotes.com$ ls client/
node_modules  package.json  package-lock.json  public  README.md  src  tsconfig.json
```

2. I took the liberty of modifying my `nginx.conf` to point to `client-old` so the old version of the website is still live will we work on the new one.

Do you want me to give you some code from the old version of the website so you can see how it is built and then you can more clearly instruct me on how to proceed? If so what would you like to see: the TypeScript code, ejs template or other?

----------
<!-- CHATGPT: -->
I apologize for any confusion. Thank you for providing the current project status. To proceed, it would be helpful to see examples of the TypeScript code and an EJS template from the old version. This will help me give you more detailed instructions on how to convert the EJS templates to React components and how to handle the TypeScript code in the new React app.

Additionally, please let me know if you have a preference between CSS modules and styled-components for handling styles in the new React app. This will help me provide specific guidance on migrating the SCSS styles
----------
To start here is the webpack.config.ts file; this gives you an idea of how the TypeScript code is compiled and bundled into the front-end. Please note I am not sure if I want to use `webpack` in the new React version we are building or if it is even necessary. I am open to your input on this.

`./helpers/plugins`:

```typescript
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';

const templateFolder: string = '../src/';

interface PluginConfig {
    filename: string;
    template: string;
    chunks?: string[];
    inject?: boolean;
}

export const makePlugins = (configs: PluginConfig[]): Object[] => {
    const plugins: Object[] = [];

    configs.forEach(v => {
        const temp: string = v.template;

        v.template = path.resolve(__dirname, `${templateFolder}${temp}`);
        plugins.push(new HtmlWebpackPlugin(v));
    });

    return plugins;
}
```

`./helpers/sections`:

```typescript
import fs from 'fs';
import path from 'path';

export const createEntriesPlugins = (section: string, chunks: string[] = ["index", "set_entry_title", "styles", "word_count"]): Object[] => {
    const entries = fs.readdirSync(path.join("src", section))
        .filter(e => e.endsWith(".ejs"))

    const plugin: Object[] = [];

    for (const entry of entries) {
        plugin.push({
            filename: path.join(section, entry.replace(".ejs", ".html")),
            template: path.join(section, entry),
            chunks: chunks
        })
    }

    return plugin;
}
```

`webpack.config.ts`:

```typescript
import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyPlugin from 'copy-webpack-plugin';

const dist_folder = 'test';

const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');

// ----------------------------
import { makePlugins } from './helpers/plugins';
import { createEntriesPlugins } from './helpers/sections';

const article_plugs: string[] = ["general_bundle", "styles", "article_bundle"];
const top_plugs: string[] = ["general_bundle", "styles", "top_level_bundle"];

const plugins: Object[] = makePlugins([
    {
        filename: "index.html",
        template: "index.ejs",
        chunks: top_plugs
    },
    ...createEntriesPlugins("blog", article_plugs) as any,
    {
        filename: "courses.html",
        template: "courses.ejs",
        chunks: top_plugs
    },
    ...createEntriesPlugins("courses", article_plugs) as any,
    {
        filename: "art.html",
        template: "art.ejs",
        chunks: top_plugs
    },
    ...createEntriesPlugins("art", article_plugs) as any,
    ...createEntriesPlugins("dictionaries", article_plugs) as any
]);

module.exports = {
    mode: "development",
    entry: {
        top_level_bundle: path.resolve(__dirname, 'src/ts/top_level_bundle.ts'), // get's cards
        general_bundle: path.resolve(__dirname, 'src/ts/general_bundle.ts'),
        article_bundle: path.resolve(__dirname, 'src/ts/article_bundle.ts'),
        account_bundle: path.resolve(__dirname, 'src/ts/account_bundle.ts'),
        styles: path.resolve(__dirname, 'src/scss/index.scss'),
        test: path.resolve(__dirname, 'src/ts/test.ts')
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader', // ?configFile=../tsconfig.test.json
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.ejs$/,
                loader: 'ejs-webpack-loader',
                options: {
                    root: path.resolve(__dirname, dist_folder),
                    data: {
                        title: "Bruh"
                    }
                }
            },
            // https://stackoverflow.com/questions/68634225/webpack-5-file-loader-generates-a-copy-of-fonts-with-hash-name
            {
                test: /\.(woff(2)?|ttf|eot)$/,
                type: 'asset/resource',
                generator: {
                    filename: './fonts/[name][ext]'
                }
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/,
                type: 'asset/resource',
                generator: {
                    filename: './images/[name][ext]'
                }
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js'],
        fallback: {
            crypto: require.resolve('crypto-browserify'), // TODO: use subtle crypto
            stream: require.resolve("stream-browserify")
        }
    },
    output: {
        filename: 'js/[contenthash].js', // temp during dev
        // filename: 'js/[name].js',
        path: path.resolve(__dirname, dist_folder),
        clean: true
    },
    plugins: [
        ...plugins,
        new FixStyleOnlyEntriesPlugin(),
        // new MiniCssExtractPlugin({ filename: "css/[name].css" }), // temp during dev
        new MiniCssExtractPlugin({ filename: "css/[contenthash].css" }), // temp during dev
        new CopyPlugin({
            patterns: [
                { // https://stackoverflow.com/questions/45036810/webpack-copying-files-from-source-to-public-using-copywebpackplugin
                    context: './src/',
                    from: "./**/*\.(ico|pdf|png|svg|jpg|jpeg|gif|mov)",
                    to: "./",
                    noErrorOnMissing: true
                }
            ]
        }),
        new CopyPlugin({
            patterns: [
                { from: "./src/manifest.json", to: "./" }
            ]
        })
    ]
}
```

Now here is for example the `general_bundle.ts`:

```typescript
import "./modules/general/price_tickers";
import "./modules/general/flex_nav";
import "./modules/general/clock";
import "./modules/general/pwa_prompt";
import "./modules/general/user_connect";
window.MathJax = { // property declared in index.d.ts
    tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']]
    },
    svg: {
        fontCache: 'global'
    }
};
```

And now here is some of the `index.ejs`:

```html
<!DOCTYPE html>
<html lang="en-uk">

<head>
    <title>
        Dereck's Notes
    </title>
    <meta name="description"
        content="The online brain of Dereck de Mezquita; making sciencing easier.">
    <meta name="keywords"
        content="Science, Programming, Bioinformatics, Biology, Technology, Education, Art, Dictionary, Blog">

    <%- include ./templates/includes/head.ejs %>
</head>

<body>
    <%- include ./templates/includes/info-bar.ejs %>
    <%- include ./templates/includes/header.ejs %>

    <%- include ./templates/includes/nav.ejs %>

    <div class="wrapper">
        <div class="card-articles">
            <!-- Cards will load here. -->
        </div>
    </div>
    <!-- hidden element informs request_entries script what page is doing the request -->
    <input hidden type="text" id="siteSection" value="blog"></div>
    <%- include ./templates/includes/footer.ejs %>
</body>

</html>
```

Finally can you tell me more about the difference between css modules vs styles-components? Would you suggest one vs the other?
--------------------
CHATGPT:
Thank you for providing the code examples. This helps me understand your current setup better. Now let's discuss the next steps.

Regarding your question about whether to use webpack in the new React version: create-react-app already comes with its own pre-configured webpack setup. This means you don't have to manage the webpack configuration manually unless you need specific customizations. If you're okay with the default setup provided by create-react-app, you can focus on migrating your code to React components.

Now let's address the differences between CSS modules and styled-components.

CSS Modules:

CSS modules are CSS files that are scoped locally by default, meaning that class names are unique and won't cause conflicts with other components.
They allow you to write standard CSS and import the styles directly into your components.
CSS modules require .module.css or .module.scss file extensions.
Styled-components:

Styled-components is a library that allows you to write CSS inside your JavaScript or TypeScript files.
It leverages tagged template literals to create styled components that encapsulate the styles.
With styled-components, you don't need separate CSS files, as the styles are defined within the components.
The choice between CSS modules and styled-components largely depends on personal preference and project requirements. If you prefer to keep styles in separate files and write standard CSS or SCSS, CSS modules might be a better choice. If you'd rather have styles and components in the same file and like the idea of using JavaScript for styling, then styled-components could be a better fit.

Now let's talk about the next steps for migrating your code:

Migrate EJS templates to React components:
Analyze the structure of your EJS templates, like index.ejs, and create corresponding React components.
For example, you can create components for the header, navigation, and footer. Replace EJS includes with React components.
Migrate TypeScript code to the new React app:
Move your TypeScript code from the client-old folder to the appropriate locations within the new React app's src folder.
For example, you can create a components folder inside src for your React components and a modules folder for utility functions or smaller pieces of code.
Update the webpack configuration (if needed):
If you find that you need specific customizations beyond what create-react-app provides, you can eject from create-react-app by running npm run eject. This will give you full control over the webpack configuration.
However, I'd recommend trying to work with the default setup provided by create-react-app first. If you find it sufficient, you won't need to manage the webpack configuration yourself.
Choose between CSS modules and styled-components:
Based on your preference, choose either CSS modules or styled-components to handle your styles.
If you choose CSS modules, rename your .scss files to .module.scss and import them into the corresponding React components.
If you choose styled-components, install the necessary packages and refactor the styles using

--------------------
Very good yes I want to use styled-components. However I also have some general scss code that applies the website as a whole. Can I use styled-components and scss together - that is a separate general style sheet for the whole website?

Also yes I want to try and stick to using the React webpack set up.

Let's start by migrating my ejs templates.

Remember `index.ejs`? Let's start with that one; what pieces do you suggest I break it down into? I am also includig the other ejs files which are used to build the `index.ejs`:

`index.ejs`:

```html
<!DOCTYPE html>
<html lang="en-uk">

<head>
    <title>
        Dereck's Notes
    </title>
    <meta name="description"
        content="The online brain of Dereck de Mezquita; making sciencing easier.">
    <meta name="keywords"
        content="Science, Programming, Bioinformatics, Biology, Technology, Education, Art, Dictionary, Blog">

    <%- include ./templates/includes/head.ejs %>
</head>

<body>
    <%- include ./templates/includes/info-bar.ejs %>
    <%- include ./templates/includes/header.ejs %>

    <%- include ./templates/includes/nav.ejs %>

    <div class="wrapper">
        <div class="card-articles">
            <!-- Cards will load here. -->
        </div>
    </div>
    <!-- hidden element informs request_entries script what page is doing the request -->
    <input hidden type="text" id="siteSection" value="blog"></div>
    <%- include ./templates/includes/footer.ejs %>
</body>

</html>
```

`head.ejs`:

```html
<!--
                              .---.
                             (_,/\ \
                            (`a a(  )
                            ) \=  ) (
                           (.--' '--.)
        /((((((\\\\        /(. )( .)  \
=======HH((((((((\\\\\    | / \    / \ |
     ((           \\\\\\\  \\ / .  \ //
     ( (*    _/      \\\\\ \/\_DdM_/\/
       \    /  \      \\\\\\|__\_/  |________
        |  |   |       </       /  /        ((\\\\       GB
        P_D   /        /       /  /           \ \\\\    \\\\\\\
             |  ._    (        M T             \ \\\\\\\\\SL\\\\\
             | /               \ \     /       /    \\\\\\\     \\
     .______/\/     /           \ \   /       /         \\\
    / __.____/    _/         ___R_D__(       /\
   / / / ________/`---------'         \     /  \_
  / /  \ \                             \   \ \_  \
 ( <    \ \                             >  /    \ \
  \/     \\_                           / /       > )
          \_|                         / /       / /
                                    _//       _//
                                   /_|       /_|
-->

<meta charset="utf-8">
<!-- <meta http-equiv="Content-Type" content="text/html; charset=utf-8"> -->
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
<meta name="author" content="Dereck de Mezquita">


<!-- Social media meta tags -->
<meta property="og:image" content="/siteImages/icons/512derecksNotesLogo.png">
<meta name="twitter:image" content="/siteImages/icons/512derecksNotesLogo.png">

<%- include ./components/pwa.ejs %>
```

`info-bar.ejs`:

```html
<div id="info-bar">
    <div id="tickers">
        <!-- Content generated should be of this format; everything other than BTC has class  info-bar-crypto-hidden -->
        <!-- <span class="info-bar-crypto">
            <span id="btc-name"></span>
            <span id="btc-price"></span>
            <span id="btc-percent" class="coin-percent-change"></span>
        </span> -->
    </div>

    <div id="info-bar-tools">
        <a class="info-bar-icon user-login-icon">
            <img src="/site-images/icons/user-login.png" class="theme-icon">
        </a>
    </div>
</div>
```

`header.ejs`:

```html
<header>
    <a href="/index.html" class="home-page-link">
        <span id="header-established">Established France 2017</span>
        <span id="header-slogan">The online brain of Dereck <span id="header-author-particule">de </span>Mezquita</span>
        <span class="header-site-name">Dereck's Notes</span>
    </a>
</header>
```

`nav.ejs`:

```html
<div class="top-nav" id="top-nav">
    <!--  -->
    <a class="inactive" href="/index.html">Blog</a>
    <a class="inactive" href="/courses.html">Courses</a>
    <a class="inactive" href="/exercises.html">Exercises</a>
    <!--  -->
    <div class="inactive dropdown">
        <div class="dropbtn">
            Dictionaries<i class="carrot-down"></i>
        </div>
        <div class="dropdown-content">
            <a href="/dictionaries/dictionary-biology.html">Biology Dictionary</a>
            <a href="/dictionaries/dictionary-chemistry.html">Chemistry Dictionary</a>
            <!-- <a href="/dictionaries/dictionary-formulas.html">Formulas Dictionary</a> -->
        </div>
    </div>
    <!--  -->
    <a class="inactive" href="/references.html">References</a>
    <!--  -->
    <a class="inactive" href="/tools.html">Tools</a>
    <!--  -->
    <a class="inactive" href="/art.html">Art</a>

    <a href="https://www.youtube.com/channel/UCzX8gJ22qtLqZuK56eT8L9g?view_as=subscriber" target="_blank" title="YouTube" class="nav-right">
        <img src="/site-images/icons/youtube.png" class="theme-icon">
    </a>
    <a href="https://www.linkedin.com/in/dereck/" target="_blank" title="LinkedIn" class="nav-right">
        <img src="/site-images/icons/linkedin.png" class="theme-icon">
    </a>

    <a class="clock nav-clock nav-right"></a>
    <a class="icon" href="javascript:void(0);" onclick="flexNav()"><span>&#9776;</span></a>
</div>
```

`footer.ejs`:

```html
<footer>
    <a href="#" class="scroll-up"><span>Scroll</span></a>

    <p>
        All content on this website is copyright and belongs to Dereck de Mezquita. You are not allowed to copy nor modify any content found on this site without written permission from the owner; &copy; Copyright 2022.
    </p>
    <p>
        Contact: <a href="mailto: contact@demezquita.com">contact@demezquita.com</a>
    </p>

</footer>
```

-------------------
Very good. Thank you. I did the following I copied all of the code for the components you gave me including:

These under: src/components/
    - Footer.tsx  Header.tsx  Head.tsx  InfoBar.tsx  Nav.tsx

And the App.tsx.

Then I have this code in index.tsx:

```react
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

reportWebVitals(console.log);
```

I got this back in the console when I ran the command:

```
dereck@localhost:/html/derecksnotes.com/client$ npm run build

> client@0.1.0 build
> react-scripts build

Creating an optimized production build...
Compiled with warnings.

[eslint] 
src/components/InfoBar.tsx
  Line 21:9:   The href attribute is required for an anchor to be keyboard accessible. Provide a valid, navigable address as the href value. If you cannot provide an href, but still need the element to resemble a link, use a button and change it with appropriate styles. Learn more: https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/HEAD/docs/rules/anchor-is-valid.md  jsx-a11y/anchor-is-valid
  Line 22:11:  img elements must have an alt prop, either with meaningful text, or an empty string for decorative images                                                                                                         jsx-a11y/alt-text
src/components/Nav.tsx
  Line 76:17:  img elements must have an alt prop, either with meaningful text, or an empty string for decorative images  jsx-a11y/alt-text
  Line 79:17:  img elements must have an alt prop, either with meaningful text, or an empty string for decorative images  jsx-a11y/alt-text

Search for the keywords to learn more about each warning.
To ignore, add // eslint-disable-next-line to the line before.

File sizes after gzip:

  60.71 kB  build/static/js/main.4786916b.js
  1.78 kB   build/static/js/787.c4e7f8f9.chunk.js

The project was built assuming it is hosted at /.
You can control this with the homepage field in your package.json.

The build folder is ready to be deployed.
You may serve it with a static server:

  npm install -g serve
  serve -s build

Find out more about deployment here:

  https://cra.link/deployment
```

As a reminder I am serving the folder: /html/derecksnotes.com/client/public using nginx.

Here is the nginx.conf; I excluded all of the other basic server stuff this is just for the react website we're working on:

```
# React test site configuration
server {
    listen       80;
    server_name  react.derecksnotes.com;

    return 301 https://$host$request_uri;
}

server {
    listen       443 ssl;
    server_name  react.derecksnotes.com;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";

    ssl_certificate      /etc/letsencrypt/live/derecksnotes.com/fullchain.pem;
    ssl_certificate_key  /etc/letsencrypt/live/derecksnotes.com/privkey.pem;

    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;

    ssl_prefer_server_ciphers on;
    ssl_ciphers  HIGH:!aNULL:!MD5:!ADH:!AECDH;

    ssl_dhparam /etc/nginx/ssl/dhparam.pem;

    add_header Strict-Transport-Security "max-age=31536000" always;

    ssl_session_cache shared:SSL:40m;
    ssl_session_timeout 4h;
    ssl_session_tickets on;

    root /html/derecksnotes.com/client/public;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

But when I go to the website: react.derecksnotes.com I don't see the result of my code. I don't think it built. What should we do now?