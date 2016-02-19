var gulp = require('gulp');
var runSeq = require('run-sequence');
var electron = require('gulp-atom-electron');
var symdest = require('gulp-symdest');
var del = require('del');
var taskListing = require('gulp-task-listing');
 
gulp.task('default', ['help']);
gulp.task('help', taskListing.withFilters(/-/));

var buildConfig = require('./gulp.config');

gulp.task('electron:windows', function(done){  
    runSeq(
        'copy-fonts',
        'copy-electron-files', 
        'build-electron', 
        done);
});

gulp.task('copy:vendor:js', function(done){  
    runSeq(
        'clean-js',
        'copy-vendor', 
        done);
});

gulp.task('copy-vendor', function () {
    return gulp.src(buildConfig.config.vendorJsFiles)
        .pipe(gulp.dest(buildConfig.config.rootJsFolder))
});

gulp.task('copy-fonts', function(done){  
    return gulp.src(
        buildConfig.config.allRootFontsFiles
    ).pipe(gulp.dest(buildConfig.config.temp.fontsFolder));
});

gulp.task('copy-electron-files', function(done){  
    return gulp.src([
        "assets/electron/*",
        "wwwroot/**/*.js",
        "wwwroot/**/*.css",
        "wwwroot/**/*.html",
        "wwwroot/index.html"
    ]).pipe(gulp.dest(buildConfig.config.temp.tempFolder));
});

gulp.task('build-electron', function(done){  
    return gulp.src(buildConfig.config.temp.allFiles)
        .pipe(electron({
            version: '0.36.7',
            platform: 'win32' }))
        .pipe(symdest('.dist/win'));
});

gulp.task('clean-js', function(done){  
       return del(buildConfig.config.temp.allRootVendorJsFiles, done);
});