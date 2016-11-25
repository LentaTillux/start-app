[ WEB - Boilerplate - App ]
========================

# React - ES6 - Gulp - Webpack - Boilerplate

Boilerplate for kick starting a project with the following technologies:
* [React](https://github.com/facebook/react)
* [Babel 6](http://babeljs.io)
* [Webpack](http://webpack.github.io) for bundling
* [Webpack Dev Server](http://webpack.github.io/docs/webpack-dev-server.html)
* [React Transform](https://github.com/gaearon/react-transform-hmr) for hot reloading React components in real time.
* etc.

The various webpack options used have been explained in detailed as comments in the config file. Should help with understanding the nitty-gritty :)

### Application Structure

```
app/
  - include/
    - html/
    - sass/
    - coffee/
    - typescript/
    - scripts/
      - coffee/
      - packages/
      - typescript/
      - main.js
  - libs/
  - styles/
    - css/
    - js/
    - index.html
build/
node_modules/ **
sh-scripts/ **

.bowerrc
README.md
bower.json
gulpfile.js
package.json
server.js
webpack.config.js
```

### Usage

```
npm install
npm start
Open http://localhost:[port]
```

### Linting

ESLint with React linting options have been enabled.

```
npm run lint
```