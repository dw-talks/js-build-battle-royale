let fs = require("fs-extra"),
    path = require("path");

// constants
const DIR = {
    dist: path.join(__dirname, "../dist/node"),
    style: path.join(__dirname, "../src/sass")
};

// build tools
let babel = require("babel-core"),
    browserSync = require("browser-sync").create(),
    linter = require("eslint").CLIEngine,
    sass = require("node-sass");

// build functions
function buildStyle() {
    let cssFile = path.join(DIR.dist, "index.css"),
        sourceMapFile = path.join(DIR.dist, "index.css.map");

    let options = {
        file: path.join(DIR.style, "index.scss"),
        outFile: cssFile,
        sourceMap: true,
        sourceMapContents: true
    };

    let result = sass.renderSync(options);

    fs.writeFileSync(cssFile, result.css);
    fs.writeFileSync(sourceMapFile, result.map);
}

function buildJavaScript() {
    let sourceFile = path.join("src/js/breakout.js"),
        sourceMapFile = path.join("dist/node/breakout.js.map"),
        transpiledSourceFile = path.join("dist/node/breakout.js");

    // linter
    let eslint = new linter();
    let lintResult = eslint.executeOnFiles([sourceFile]);

    if(!lintResult.errorCount) {
        let sourceFileResult = babel.transformFileSync(sourceFile, { sourceMap: "both", sourceRoot: "../../src/js" });
        fs.writeFileSync(transpiledSourceFile, sourceFileResult.code);
        fs.writeFileSync(sourceMapFile, JSON.stringify(sourceFileResult.map));
    }
    else {
        console.error("There were eslint errors");

        lintResult.results.forEach(function(element) {
            console.error(element);
        }, this);
    }
}

function buildLibs() {
    fs.copySync("node_modules/systemjs/dist/system.js", "dist/node/system.js");
}

function buildHtml() {
    fs.copySync("src/html/index.html", "dist/node/index.html");
}

function setupBuild() {
    fs.mkdirs("dist/node");
}

function build() {
    console.log("Starting build...");

    setupBuild();

    buildStyle();
    buildJavaScript();
    buildLibs();
    buildHtml();

    console.log("...Build complete!");
}

function serve() {
    let bsOptions = {
        port: 8080,
        ui: {
            port: 8081  
        },
        server: "./dist/node",
        files: [
            {
                match: "./src/sass/*.scss",
                fn: function(event, file) {
                    // https://github.com/sass/node-sass/issues/1894
                    buildStyle();
                    browserSync.reload();
                }
            },
            {
                match: "./src/js/*.js",
                fn: function(event, file) {
                    buildJavaScript();
                    browserSync.reload();
                }
            },
            {
                match: "./src/html/*.html",
                fn: function(event, file) {
                    buildHtml();
                    browserSync.reload();
                }
            }
        ]
    }
    browserSync.init(bsOptions);
}

module.exports = {
    build,
    serve
}