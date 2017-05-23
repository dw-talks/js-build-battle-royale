#! env/usr/bin node
let fs = require("fs-extra"),
    path = require("path");

// constants
const DIR = {
    dist: path.join(__dirname, "../dist/node"),
    style: path.join(__dirname, "../src/sass")
};

// build tools
let babel = require("babel-core"),
    linter = require("eslint").CLIEngine,
    sass = require("node-sass");

// build functions
function buildStyle() {
    let cssFile = path.join(DIR.dist, "index.css"),
        sourceMapFile = path.join(DIR.dist, "index.css.map");

    let options = {
        file: path.join(DIR.style, "index.scss"),
        outFile: cssFile,
        sourceMap: true
    };

    let result = sass.renderSync(options);

    fs.writeFileSync(cssFile, result.css);
    fs.writeFileSync(sourceMapFile, result.map);
}

function buildJavaScript() {
    let sourceFile = path.join("src/js/breakout.js"),
        sourceMapFile = path.join("dist/node/breakout.js.map"),
        transpiledFile = path.join("dist/node/breakout.js");

    let eslint = new linter();
    let lintResult = eslint.executeOnFiles([sourceFile]);

    if(!lintResult.errorCount) {
        let result = babel.transformFileSync(sourceFile);

        fs.writeFileSync(transpiledFile, result.code);
        fs.writeFileSync(sourceMapFile, JSON.stringify(result.map));
    }
    else {
        console.error("There were eslint errors");

        lintResult.results.forEach(function(element) {
            console.error(element);
        }, this);
    }
}

function buildLibs() {
    fs.copySync("node_modules/systemjs/dist/system-production.js", "dist/node/system.js");
}

function buildHtml() {
    fs.copySync("src/html/index.html", "dist/node/index.html");
}

function setupBuild() {
    fs.mkdirs("dist/node");
}

// build script
console.log("Starting build...");

setupBuild();

buildStyle();
buildJavaScript();
buildLibs();
buildHtml();

console.log("...Build complete!");