# Setup

Here I will document the steps I took to create this codebase. I tend to forget the steps such as installing tools and packages **et cetera**. This is useful for me as well as for others learning; demonstrating better helps to grasp these concepts.

## Project structure

First created the project structure:

- server/
    - src
        - express-server
            - server.ts
    - dist
- client/
    - src
    - dist
        - ts
        - scss

## Init project and install packages

I am starting this from the root of the project `/`.

I installed the necessary tools starting with `npm` and `TypeScript`:

```bash
npm init -y

npm install --save-dev -g typescript

cd server

tsc -init
```

Now I will write the code for the server this is file `server.ts`. We are using `express` and thus, I must install these:

```bash
npm install --save express
npm install --save-dev @types/express
```

## Webpack setup

Install webpack as a dev dependency:

```bash
npm install -D webpack webpack-cli
```
In order to use webpack we need to define a script in our `package.json` this will allow us to say: `npm run build`.

We add this to our `package.json`:


```json
"scripts": {
    "dev": "webpack --config client/webpack.config.js --mode development",
    "pro": "webpack --config client/webpack.config.js --mode production --env.production"
}
```

## Webpack loaders

Loaders allow you to load other assets, images, css, sass etc.

### `sass` loader

```bash
npm install -D sass style-loader css-loader sass-loader
```

### html plugin

Plugins are more powerful.

```bash
npm install -D html-webpack-plugin
```

## `ejs`

```bash
npm install --save-dev -g ejs
```

https://stackoverflow.com/questions/45150819/html-webpack-plugin-not-parsing-ejs-variables

```txt
<% 'Scriptlet' tag, for control-flow, no output
<%_ 'Whitespace Slurping' Scriptlet tag, strips all whitespace before it
<%= Outputs the value into the template (escaped)
<%- Outputs the unescaped value into the template
```