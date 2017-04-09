[ WEB - Boilerplate - App ]
========================

# React - ES6 - Gulp - Webpack - Boilerplate

Boilerplate for kick starting a project with the following technologies:
* [React](https://github.com/facebook/react)
* [Babel 6](http://babeljs.io)
* [Webpack](http://webpack.github.io) for bundling
* [Webpack Dev Server](http://webpack.github.io/docs/webpack-dev-server.html)
* [React Transform](https://github.com/gaearon/react-transform-hmr) for hot reloading React components in real time. (NO!)
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
        - react/
          - index.js
          - webpack.config.gulp.js
      - typescript/
      - app.js
  - libs/               //Bower: jQuery, Bootstrap, React, etc.
  - styles/
    - css/
    - js/
      - packages/
        - react/
    - index.html
build/
node_modules/ **
sh-scripts/ **
IGNORE/ **

.bowerrc
.gitignore
README.md
bower.json
gulpfile.js
package.json
server.js
webpack.config.js
webpack.config.gulp.js //clone file - for copy in packages/[name_pack]
```
### Usage
> __Warning install!__
typescript, babel...

```
npm install -g gulp
npm install gulp-typescript typescript gulp-file-include
npm install
npm start
Open http://localhost:[port]/app
```
#### Develop
```
gulp watch
__or(default)__
gulp
__or()__
webpack
```

