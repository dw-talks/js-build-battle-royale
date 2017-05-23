#! usr/bin/env node
let buildUtils = require("./tasks");

let buildCommand = process.argv[2];

if(buildCommand === "build") {
    buildUtils.build();
}
else if(buildCommand === "serve") {
    buildUtils.build();
    buildUtils.serve();
}
else {
    console.error("You must provide and argument of either \"build\" or \"serve\"");
}