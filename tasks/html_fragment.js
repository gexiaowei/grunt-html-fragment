/*
 * grunt-html-fragment
 * https://github.com/gexiaowei/grunt-html-fragment
 *
 * Copyright (c) 2015 gandxiaowei@gmail.com
 * Licensed under the MIT license.
 */

'use strict';

var cheerio = require('cheerio');
var path = require('path');

module.exports = function (grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('html_fragment', 'The best Grunt plugin ever.', function () {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            punctuation: '',
            separator: ', ',
            fragmentPath: 'fragment/'
        });

        /**
         * 获取替换的html碎片内容
         * @param fragment HTML碎片文件
         * @param commandInfo 需要改变的命令
         */
        function getReplaceHTML(fragment, commandInfo) {
            var $ = cheerio.load(fragment);
            if (commandInfo) {
                var commands = commandInfo.split(',');
                commands.forEach(function (command) {
                    var args = command.trim().split('->');
                    if (args.length > 2) {
                        grunt.log.warn(args[0]);
                        $(args[0])[args[1]](args[2]);
                    }
                });
            }
            return $.html();
        }

        function createHTML(filepath) {
            var contents = grunt.file.read(filepath);
            var match;
            var successCount = 0, failCount = 0;
            while (match = findInclude(contents)) {
                grunt.log.warn('==>match include:' + match.content);
                var pathWithCommand = match.path.split('::'),
                    path = pathWithCommand[0],
                    command = pathWithCommand[1];
                var fragmentPath = options.fragmentPath + path;
                var fragmentContents;
                if (grunt.file.exists(fragmentPath)) {
                    fragmentContents = grunt.file.read(fragmentPath);
                    contents = contents.replace(match.content, getReplaceHTML(fragmentContents, command));
                    successCount++;
                } else {
                    contents = contents.replace(match.content, '');
                    failCount++
                }
            }
            grunt.log.warn('==>End replace(' + successCount + ' success,' + failCount + ' fail)');
            return contents;
        }


        function findInclude(string) {
            var regex = /<!--\s*@@include\s*[= ]\s*(\S+)\s*(?:([^-]+)\s*)?-->/;
            var match = string.match(regex);
            return match ? {
                content: match[0],
                path: match[1]
            } : null

        }

        // Iterate over all specified file groups.
        this.files.forEach(function (f) {
            // Concat specified files.
            var src = f.src.filter(function (filepath) {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            }).map(function (filepath) {
                // Read file source.
                return createHTML(filepath);
            });

            // Write the destination file.
            var outPath = f.dest + path.basename(f.src);
            grunt.file.write(outPath, src);

            // Print a success message.
            grunt.log.writeln('File "' + outPath + '" created.');
        });
    });

};
