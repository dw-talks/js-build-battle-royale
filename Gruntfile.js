module.exports = function(grunt) {
    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        babel: {
            options: {
                sourceMaps: true
            },
            dist: {
                files: [
                    { src: "src/js/index.js", dest: "dist/grunt/index.js" },
                    { src: "src/js/breakout.js", dest: "dist/grunt/breakout.js" }
                ]
            }
        },
        browserSync: {
            options: {
                port: 8080,
                ui: {
                    port: 8081
                },
                server: "dist/grunt",
                watchTask: true
            },
            bsFiles: {
                src: [
                    "src/js/*.js",
                    "src/sass/*.scss",
                    "src/html/*.html"
                ] 
            }
        },
        copy: {
            html: {
                files: [
                    { src: "src/html/index.html", dest: "dist/grunt/index.html" }
                ]
            },
            libs: {
                files: [
                    { src: "./node_modules/systemjs/dist/system.js", dest: "dist/grunt/system.js" }
                ]
            }
        },
        eslint: {
            dist: {
                src: ["src/js/**/*.js"]
            }
        },
        sass: {
            options: {
                sourceMaps: true
            },
            dist: {
                files: [
                    { src: "src/sass/index.scss", dest: "dist/grunt/index.css" }
                ]
            }
        },
        watch: {
            html: {
                files: "src/html/*.html",
                tasks: ["copy:html"]
            },
            sass: {
                files: "src/sass/*.scss",
                tasks: ["sass"]
            },
            js: {
                files: "src/js/*.js",
                tasks: ["eslint","babel"]
            },
        }
    });

    // load plugins
    grunt.loadNpmTasks("grunt-babel");
    grunt.loadNpmTasks("grunt-browser-sync");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("gruntify-eslint");
    grunt.loadNpmTasks("grunt-sass");
    grunt.loadNpmTasks("grunt-contrib-watch");

    // tasks
    grunt.registerTask("build", ["sass","eslint","babel","copy:libs","copy:html"]);
    grunt.registerTask("serve", ["build","browserSync","watch:html","watch:sass","watch:js"]);
    grunt.registerTask("default", ["build"]);
}