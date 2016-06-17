/**
 * grunt-trimtrailingspaces
 * https://github.com/paazmaya/grunt-trimtrailingspaces
 *
 * Copyright (c) Juga Paazmaya <olavic@gmail.com>
 * Licensed under the MIT license.
 */
'use strict';

module.exports = function trimtrailingspaces(grunt) {

  grunt.registerMultiTask('trimtrailingspaces', 'Removing the trailing spaces', function register() {
    var taskSucceeded = true;

    // Default options extended with user defined
    var options = this.options({
      encoding: 'utf8',
      failIfTrimmed: false
    });
    var fsOptions = { // Filesystem access options
      encoding: options.encoding
    };
    var changedFileCount = 0;

    this.files.forEach(function filesEach(file) {

      // Iterate src as that is where the actual files are
      file.src.forEach(function srcEach(src) {
        grunt.verbose.writeln('Processing file: ' + src);

        var content = grunt.file.read(src, fsOptions);
        var destination = src;
        // dest might be undefined, thus use same directory as src
        if (typeof file.dest === 'string') {
          if (!grunt.file.exists(file.dest)) {
            grunt.file.mkdir(file.dest);
          }
          destination = file.dest + '/' + src.split('/').pop();
        }

        var trimmed = content.replace(/[ \f\t\v]*$/gm, '');

        if (content !== trimmed) {
          grunt.verbose.writeln('Needed trimming, file: ' + src);
          ++changedFileCount;
          grunt.file.write(destination, trimmed, fsOptions);
        }
        else if (src !== destination) {
          // Copy to destination if not in place modification
          grunt.file.copy(src, destination, fsOptions);
        }


      });
    });

    if (changedFileCount > 0 && options.failIfTrimmed) {
      grunt.fail.warn(changedFileCount + ' files had whitespace trimmed, and the failIfTrimmed option is set to true.', 6);
    }

    return taskSucceeded;
  });

};
