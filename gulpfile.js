"use strict";

let gulp = require("gulp"),
    babel = require("gulp-babel"),
    browserSync = require("browser-sync").create(),
    eslint = require("gulp-eslint"),
    sass = require("gulp-sass"),
    sourcemaps = require("gulp-sourcemaps");

const BUILD_DIR  = "./dist/gulp",
        SRC_JS = "./src/js/**/*.js",
        SRC_HTML = "./src/html/**/*.html",
        SRC_SASS = "./src/sass/**/*.scss";
      

gulp.task("default", ["build"]);
gulp.task("build", ["build:sass","build:js","build:html"]);

gulp.task("build:html", ()=> {
    return gulp.src(SRC_HTML)
                .pipe(gulp.dest(BUILD_DIR));
})

gulp.task("build:sass", ()=> {
    return gulp.src(SRC_SASS)
            .pipe(sourcemaps.init())
            .pipe(sass().on("error", sass.logError))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(BUILD_DIR));
})

gulp.task("build:js", ["lint:js","libs:js"], ()=> {
    return gulp.src(SRC_JS)
                .pipe(sourcemaps.init())
                .pipe(babel())
                .pipe(sourcemaps.write("."))
                .pipe(gulp.dest(BUILD_DIR));
})

gulp.task("lint:js", ()=> {
    return gulp.src([SRC_JS, "!./node_modules/**"])
                .pipe(eslint())
                .pipe(eslint.format())
                .pipe(eslint.failAfterError());
})

gulp.task("libs:js", ()=> {
    let libs = [
        "./node_modules/systemjs/dist/system.js"
        ];
    
    return gulp.src(libs)
                .pipe(gulp.dest(BUILD_DIR));
})

gulp.task("serve", ["build"], ()=> {
    browserSync.init({
        port: 8080,
        ui: {
            port: 8081
        },
        server: BUILD_DIR
    });

    gulp.watch(SRC_JS,["watch:js"]);
    gulp.watch(SRC_HTML, ["watch:html"]);
    gulp.watch(SRC_SASS, ["watch:sass"]);
})

gulp.task("watch:js", ["build:js"], (done)=> {
    browserSync.reload();
    done();
})

gulp.task("watch:html", ["build:html"], (done)=> {
    browserSync.reload();
    done();
})

gulp.task("watch:sass", ["build:sass"], (done)=> {
    browserSync.reload();
    done();
})
