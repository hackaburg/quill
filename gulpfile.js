require("dotenv").load({ silent: true });

const gulp = require("gulp");
const sassCompiler = require("gulp-sass");
const minifyCss = require("gulp-minify-css");
const concat = require("gulp-concat");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");
const ngAnnotate = require("gulp-ng-annotate");
const nodemon = require("gulp-nodemon");

const environment = process.env.NODE_ENV;

function swallowError(error) {
  //If you want details of the error in the console
  console.log(error.toString());
  this.emit("end");
}

const js = async () => {
  if (environment !== "dev") {
    gulp
      .src(["app/client/src/**/*.js", "app/client/views/**/*.js"])
      .pipe(sourcemaps.init())
      .pipe(concat("app.js"))
      .pipe(ngAnnotate())
      .on("error", swallowError)
      .pipe(uglify())
      .pipe(gulp.dest("app/client/build"));
  } else {
    gulp
      .src(["app/client/src/**/*.js", "app/client/views/**/*.js"])
      .pipe(sourcemaps.init())
      .pipe(concat("app.js"))
      .pipe(ngAnnotate())
      .on("error", swallowError)
      .pipe(sourcemaps.write())
      .pipe(gulp.dest("app/client/build"));
  }
};

const sass = async () => {
  gulp
    .src("app/client/stylesheets/site.scss")
    .pipe(sassCompiler())
    .on("error", sassCompiler.logError)
    .pipe(minifyCss())
    .pipe(gulp.dest("app/client/build"));
};

const build = gulp.parallel(js, sass);

const watch = gulp.series(js, sass, async () => {
  gulp.watch("app/client/src/**/*.js", js);
  gulp.watch("app/client/views/**/*.js", js);
  gulp.watch("app/client/stylesheets/**/*.scss", sass);
});

const server = gulp.parallel(watch, async () => {
  nodemon({
    script: 'app.js',
    env: { 'NODE_ENV': process.env.NODE_ENV || 'DEV' },
    watch: [
      'app/server'
    ]
  });
});

module.exports = {
  build,
  default: async () => {
    console.log("yo. use gulp watch or something");
  },
  js,
  sass,
  server,
  watch
};
