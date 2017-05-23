#! env/usr/bin node
let fs = require("fs-extra"),
    path = require("path");

// constants
const DIR = {
    dist: path.join(__dirname, "../build/node"),
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
        sourceMapFile = path.join("build/node/breakout.js.map"),
        transpiledFile = path.join("build/node/breakout.js");

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

// build script
console.log("Starting build...");

buildStyle();
buildJavaScript();

console.log("...Build complete!");