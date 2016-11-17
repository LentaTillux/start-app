//'use strict';
/*
var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;
*/
var gulp         = require('gulp'),             //Gulp - система сборки и задач
    util         = require('gulp-util'),        //Utility functions for gulp plugins
    browserSync  = require('browser-sync'),     //Live CSS Reload & Browser Syncing
    del          = require('del'),              //Delete files and folders
    rename       = require('gulp-rename'),      //Rename files
    cache        = require('gulp-cache'),       //A cache proxy plugin for Gulp
    concat       = require('gulp-concat'),      //Concatenates + files
    rigger       = require('gulp-rigger'),     //import file to file ( //= footer.html )

    coffee       = require('gulp-coffee'),      //синтаксический сахар для JS
    typescript   = require('gulp-typescript'),  //A compiler for gulp with incremental compilation support.
    babel        = require('gulp-babel'),       //Can using ES6 with gulp
    sass         = require('gulp-sass'),        //синтаксический сахар для CSS
    cssnano      = require('gulp-cssnano'),     //Minify CSS
    autoprefixer = require('gulp-autoprefixer');//CSS autoprefix
var uglifyjs     = require('gulp-uglifyjs');    //Minify multiple files !DEPRECATED

var reload = browserSync.reload;

//rigger-html
//sass-css--autoprefixer--cssnano
//typescript-js
//coffee-js
//js--babel-main.js--uglifyjs-main.min.js
//npm i --save-dev gulp gulp-util browser-sync del gulp-rename gulp-cache gulp-concat gulp-rigger gulp-coffee gulp-typescript gulp-babel gulp-sass gulp-cssnano gulp-autoprefixer gulp-uglifyjs

var path = {
    build: {
        home:   'build',
        html:   'build/',
        js:     'build/styles/js/',
        css:    'build/styles/css/',
        img:    'build/styles/img/',
        fonts:  'build/styles/fonts/'
    },
    app: {
        home:   'app',
        html:   'app/',
        js:     'app/styles/js/',
        css:    'app/styles/css/',
        img:    'app/styles/img/',
        fonts:  'app/styles/fonts/',
        htmls:  'app/include/html/',
        sass:   'app/include/sass/',
        coffee: 'app/include/coffee/',
        ts:     'app/include/typescript/',
        react:  'app/include/react/',
        babel:  'app/include/scripts/',
        libs:   'app/libs'
    },
    watch: {
        html:  'app/*.html',
        js:     'app/styles/js/**/*.js',
        css:    'app/styles/css/**/*.css',
        img:    'app/styles/img/**/*.*',
        fonts:  'app/styles/fonts/**/*.*',
        htmls:  'app/include/html/**/*.html',
        sass:   'app/include/sass/**/*.sass',
        coffee: 'app/include/coffee/**/*.coffee',
        ts:     'app/include/typescript/**/*.ts',
        babel:  'app/include/scripts/**/*.js'
    },
    clean: './build'
};

var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "Frontend_Devil"
};

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('clean', function () {
    del.sync(path.clean);
});

gulp.task('cache:clear', function () {
  //очищение кеша
  return cache.clearAll();
});

gulp.task('include:html', function () {
    gulp.src([path.app.htmls+'**/*.html'])
        .pipe(rigger())
        .pipe(gulp.dest(path.app.html));
});

gulp.task('styles:sass', function () {
    gulp.src([path.app.sass+'**/*.sass', path.app.sass+'**/*.css'])
        .pipe(sass())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'],
            { cascade: true }))              //CSS префиксы
        .pipe(gulp.dest(path.app.css));      //Результат выгрузить в директорию
});
gulp.task('styles:css', ['styles:sass'], function () {
    gulp.src(['!'+path.app.css+'**/*.min.css', path.app.css+'**/*.css'])
        .pipe(cssnano())                     //Сжатие файлов
        .pipe(rename({suffix: '.min'}))      //Добавление суффикса .min
        .pipe(gulp.dest(path.app.css));      //Результат выгрузить в директорию
});

gulp.task('include:coffee', function () {
    gulp.src([path.app.coffee+'**/*.coffee'])
        .pipe(coffee({bare: true}).on('error', util.log))
        .pipe(gulp.dest(path.app.babel+'coffee/'));
});

gulp.task('include:ts', function () {
    gulp.src([path.app.ts+'**/*.ts'])
        .pipe(typescript({ noImplicitAny: true }))
        .pipe(gulp.dest(path.app.babel+'typescript/'));
});

gulp.task('include:es', function () {
    gulp.src(['!'+path.app.babel+'react/', path.app.babel+'**/*.js'])
        .pipe(babel({ presets: ['es2015'] }))
        .pipe(gulp.dest(path.app.js));
});

gulp.task('styles:js', ['include:es'], function () {
    gulp.src(['!'+path.app.js+'**/app.min.js', path.app.js+'**/*.js'])
      .pipe(concat('app.min.js'))     //Собираем файлы
      .pipe(uglifyjs())               //Сжатие JS файла
      .pipe(gulp.dest(path.app.js));  //Результат выгрузить в директорию
});

gulp.task('project:start', [
    'include:html',
    'styles:css',
    'include:coffee',
    'include:ts',
    'styles:js',
]);
//
gulp.task('watch', ['project:start'], function(){
    gulp.watch([path.watch.htmls],  ['include:html']);
    gulp.watch([path.watch.sass],   ['styles:css']);
    gulp.watch([path.watch.coffee], ['include:coffee']);
    gulp.watch([path.watch.ts],     ['include:ts']);
    gulp.watch([path.watch.babel],  ['styles:js']);
    //gulp.watch([path.watch.html],   reload);
    //gulp.watch([path.watch.js],     reload);
    //gulp.watch([path.watch.css],    reload);
    //gulp.watch([path.watch.img],    reload);
    //gulp.watch([path.watch.fonts],  reload);
});
//
gulp.task('project:build', function () {
});

gulp.task('default', ['project:build', 'webserver', 'watch']);
//
/*
gulp.task('html:build', function () {
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
    gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('style:build', function () {
    gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: ['src/style/'],
            outputStyle: 'compressed',
            sourceMap: true,
            errLogToConsole: true
        }))
        .pipe(prefixer())
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
    gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build'
]);


gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});

gulp.task('default', ['build', 'webserver', 'watch']);
*/