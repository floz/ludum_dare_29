var gulp = require( "gulp" );
var debug = require( "gulp-debug" );
var changed = require( "gulp-changed" );
var cached = require( "gulp-cached" );
var stylus = require( "gulp-stylus" );
var jade = require( "gulp-jade" );
var browserify = require( "gulp-browserify" );
var gutil = require( "gulp-util" );
var rename = require( "gulp-rename" );
var browserSync = require( "browser-sync" );
var nib = require( "nib" );
var html = require( "html-browserify" );

var src = {
  styles: "src/styles/*.styl",
  scripts: "src/scripts/main.coffee"
}

gulp.task( "browser-sync", function() {

  browserSync.init( [ "app/js/*.js", "app/css/*.css", "app/*.html" ], {
    server: {
      baseDir: "./app"
    }
  } );

} );

gulp.task( "styles", function() {
  gulp.src( src.styles )
      .pipe( stylus( { use: [ nib() ], url: { paths: [ "app/img/" ] } } ) )
        .on( "error", gutil.log )
        .on( "error", gutil.beep )
      .pipe( gulp.dest( "app/css/" ) );
        
} );

gulp.task( "scripts", function() {
  gulp.src( src.scripts, { read: false } )
      .pipe( cached( src.scripts ) )
      .pipe( changed( src.scripts ) )
      .pipe( browserify( { transform: [ html, "coffeeify" ], extensions: [ ".coffee" ] } ) )
        .on( "error", gutil.log )
        .on( "error", gutil.beep )
      .pipe( rename( "app.js" ) )
      .pipe( gulp.dest( "app/js" ) );

} );

gulp.task( "watch", function() {

  gulp.watch( "src/styles/*.styl", [ "styles" ] );
  gulp.watch( "src/scripts/**/*.html", [ "scripts" ] );
  gulp.watch( "src/scripts/**/*.coffee", [ "scripts" ] );

} );

gulp.task( "default", [ "browser-sync", "styles", "scripts", "watch" ] );
