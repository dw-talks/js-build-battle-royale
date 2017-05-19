// tools
let funnel = require("broccoli-funnel"),
    mergeTrees = require("broccoli-merge-trees");

// plugins
let babel = require("broccoli-babel-transpiler"),
    BrowserSync = require("broccoli-browser-sync"),
    eslint = require("broccoli-lint-eslint"),
    sass = require("broccoli-sass");

const BUILD_DIR  = "./dist/broccoli",
        JS_DIR = "./src/js/",
        HTML_DIR = "./src/html/",
        SASS_DIR = "./src/sass/",
        SYSTEMJS_DIR = "./node_modules/systemjs/dist/";

// lint
const linter = eslint(JS_DIR, {
    throwOnError: true,
    throwOnWarn: true,
    options: {
        configFile: "./.eslintrc.json"
    }
});

// build
const styles = sass([SASS_DIR],"index.scss","index.css");
const script = babel(linter);
const libs = funnel(SYSTEMJS_DIR, { files: ["system.js"]});
const markup = funnel(HTML_DIR, {files: ["index.html"]});

// browsersync
const options = {
    browserSync: {
        port: 8080,
        ui: {
            port: 8081
        }
    }
}
let browserSync = new BrowserSync([linter, styles, script, libs, markup], options);

module.exports = mergeTrees([linter, styles, script, libs, markup, browserSync], { overwrite: true });