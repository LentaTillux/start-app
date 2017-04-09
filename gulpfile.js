/* Gulp
 * html: rigger-html
 * css: sass->css->(--autoprefixer--cssnano)
 * js: (coffee/typescript)->(--babel--uglify)
 * jsx: jsx->webpack->(--babel--uglify)
*/

var gulp         = require('gulp'),             //Gulp - система сборки и задач
    util         = require('gulp-util'),        //Utility functions for gulp plugins
    browserSync  = require('browser-sync'),     //Live CSS Reload & Browser Syncing
    del          = require('del'),              //Delete files and folders
    rename       = require('gulp-rename'),      //Rename files
    cache        = require('gulp-cache'),       //A cache proxy plugin for Gulp
    concat       = require('gulp-concat'),      //Concatenates + files
    rigger       = require('gulp-rigger'),      //import file to file ( //= footer.html )
    fileinclude  = require('gulp-file-include'), //import file to file https://github.com/coderhaoxin/gulp-file-include
    webpack      = require('webpack-stream'),     //webpack plugin for gulp

    coffee       = require('gulp-coffee'),      //синтаксический сахар для JS
    typescript   = require('gulp-typescript'),  //A compiler for gulp with incremental compilation support.
    babel        = require('gulp-babel'),       //Can using ES6 with gulp
    sass         = require('gulp-sass'),        //синтаксический сахар для CSS
    cssnano      = require('gulp-cssnano'),     //Minify CSS
    autoprefixer = require('gulp-autoprefixer');//CSS autoprefix
var uglify     = require('gulp-uglify');    //Minify multiple files !DEPRECATED

var reload = browserSync.reload;

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
        js:     'app/include/js/',
        css:    'app/include/css/',
        img:    'app/include/img/',             //
        fonts:  'app/include/fonts/',           //
        htmls:  'app/include/html/',            //
        sass:   'app/include/sass/',            //
        babel:  'app/include/scripts/',         //
        coffee: 'app/include/coffee/',
        ts:     'app/include/typescript/',
        packages:  'app/include/scripts/packages/',
        pack_react:  'app/include/scripts/packages/react/',
        libs:   'app/libs'
    },
    watch: {
        html:  'app/*.html',
        jsmin:  'build/styles/js/**/*.js',
        cssmin: 'build/styles/css/**/*.css',
        img:    'app/include/img/**/*.*',       //
        fonts:  'app/include/fonts/**/*.*',     //
        htmls:  'app/include/html/**/*.html',   //
        sass:   'app/include/sass/**/*.*',      //
        babel:  'app/include/scripts/**/*.js',  //
        coffee: 'app/include/coffee/**/*.coffee',
        ts:     'app/include/typescript/**/*.ts',
        pack_react:  'app/include/scripts/packages/react/**/*.*'
    },
    clean: './build'
};

/*var server = {
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "Frontend_Devil"
};

gulp.task('webserver', function () {
    browserSync(server);
});*/

gulp.task('clean', function () {
    del.sync(path.clean);
});

gulp.task('cache:clear', function () {
  //очищение кеша
  return cache.clearAll();
});

gulp.task('no-include:html', function () { //устарел - в будущем удалится
    gulp.src(["!"+path.app.htmls+'packages/**', path.app.htmls+'**/*.html'])
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html));
});
gulp.task('include:html', function() {
  gulp.src(["!"+path.app.htmls+'packages/**', path.app.htmls+'**/*.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest(path.build.html));
});

gulp.task('styles:sass', function () {
    gulp.src([path.app.sass+'**/*.sass',path.app.sass+'**/*.scss', path.app.sass+'**/*.css'])
        .pipe(sass())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'],
            { cascade: true }))              //CSS префиксы
        .pipe(gulp.dest(path.build.css));      //Результат выгрузить в директорию
});

gulp.task('styles:cssmin',  function () {
    gulp.src(['!'+path.build.css+'**/*.min.css', path.build.css+'**/*.css'])
        .pipe(cssnano())                     //Сжатие файлов
        .pipe(rename({suffix: '.min'}))      //Добавление суффикса .min
        .pipe(gulp.dest(path.build.css));      //Результат выгрузить в директорию
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
    gulp.src(['!'+path.app.packages+'**', path.app.babel+'**/*.js'])
        .pipe(babel({ presets: ['es2015'] }))
        .pipe(gulp.dest(path.build.js));
});

gulp.task('styles:js', function () {
    gulp.src(['!'+path.build.js+'**/*.min.js','!'+path.build.js+'packages/**', path.build.js+'**/*.js'])
      .pipe(concat('app.min.js'))     //Собираем файлы
      .pipe(uglify())                 //Сжатие JS файла
      .pipe(gulp.dest(path.build.js));  //Результат выгрузить в директорию
});
gulp.task('styles:javascript', [
    'include:es',
    'styles:js'
]);

//img + fonts + etc. copy
gulp.task('include:img', function () {
    gulp.src([path.app.img+'**/*.*'])
        .pipe(gulp.dest(path.build.img));
});
gulp.task('include:fonts', function () {
    gulp.src([path.app.fonts+'**/*.*'])
        .pipe(gulp.dest(path.build.fonts));
});

//
// Packages: Webpack(ES), etc.
//
gulp.task('include:webpack:react', function() {
    return gulp.src([path.app.pack_react+'index.js'])
        .pipe(webpack( require('./'+path.app.pack_react+'webpack.config.gulp.js') ))
        .pipe(gulp.dest(path.build.js+'packages/react/'));
});

gulp.task('include:packages', [
    'include:webpack:react',
    'styles:js'
]);

gulp.task('project:start', [
    'include:html',
    'styles:sass',
    'styles:cssmin',
    'include:coffee',
    'include:ts',
    'include:packages',
    'styles:javascript'
]);
//
// Start Gulp and Watch
//
gulp.task('watch', ['project:start'], function(){
    gulp.watch([path.watch.htmls],      ['include:html']);
    gulp.watch([path.watch.sass],       ['styles:sass']);
    gulp.watch([path.watch.cssmin],     ['styles:cssmin']);
    gulp.watch([path.watch.coffee],     ['include:coffee']);
    gulp.watch([path.watch.ts],         ['include:ts']);
    gulp.watch([path.watch.babel],      ['styles:javascript']);
    gulp.watch([path.watch.pack_react], ['include:packages']);
    gulp.watch([path.watch.img],        ['include:img']);
    gulp.watch([path.watch.fonts],      ['include:fonts']);
    //gulp.watch([path.watch.html],   reload);
    //gulp.watch([path.watch.jsmin],  reload);
    //gulp.watch([path.watch.cssmin], reload);
    //gulp.watch([path.watch.img],    reload);
    //gulp.watch([path.watch.fonts],  reload);
});
//
// Build
//
gulp.task('project:build', function () {
});

gulp.task('default', ['project:build',
                      //'webserver',
                      'watch']);
