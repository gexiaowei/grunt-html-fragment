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

    grunt.registerMultiTask('html_fragment', '', function () {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            fragmentPath: 'fragment/',
            needReplacePath: true,
            useMin: false,
            pathDefined: [],
            absoluteHeads: []
        });

        //定义绝对路径开头
        var absoluteHeads = ['http://', 'https://', '\\\\'].concat(options.absoluteHeads),
            absoluteReg = new RegExp('^(' + absoluteHeads.join('|') + ')');
        //定义需要替换路径的标签信息
        var replacePathTags = [
            {tag: 'img', attr: 'src'},
            {tag: 'script', attr: 'src'},
            {tag: 'link', attr: 'href'},
            {tag: 'a', attr: 'href'}
        ].concat(options.pathDefined);

        /**
         * 获取替换的html碎片内容
         * @param fragment HTML碎片文件
         * @param commandInfo 需要改变的命令
         * @param output 碎片导入的文件路径
         */
        function getReplaceHTML(fragmentPath, commandInfo, output) {
            var fragment = grunt.file.read(fragmentPath);
            var $ = cheerio.load(fragment, {decodeEntities: false});
            if (commandInfo) {
                var commands = commandInfo.split(',');
                commands.forEach(function (command) {
                    var args = command.trim().split('->');
                    if (args.length > 2) {
                        $(args[0])[args[1]](args[2]);
                    }
                });
            }
            if (options.needReplacePath) {
                var i, temp;
                replacePathTags.forEach(function (replacePathTag) {
                    var tags = $(replacePathTag.tag),
                        attr = replacePathTag.attr;
                    for (i = 0; i < tags.length; i++) {
                        temp = $(tags[i]);
                        var sourcePath = temp.attr(attr);
                        if (sourcePath && !isAbsolute(sourcePath)) {
                            temp.attr(attr, path.relative(path.dirname(output), path.join(options.fragmentPath, sourcePath)));
                        }
                    }
                });
            }
            return $.html();
        }

        /**
         * 判断路径是否为绝对路径
         * @param path 需要判断的路径
         * @returns {boolean}
         */
        function isAbsolute(path) {
            return absoluteReg.test(path);
        }

        /**
         * 获取压缩文件的路径
         * @param filePath 文件中引用的地址
         * @param output 文件的地址
         * @returns {string} 压缩文件的路径
         */
        function getMinPath(filePath, output) {
            if (isAbsolute(filePath)) {
                return filePath;
            }
            var fileInfo = path.parse(filePath);
            var outputInfo = path.parse(output);
            var minPath = path.join(fileInfo.dir, fileInfo.name + '.min' + fileInfo.ext);
            if (grunt.file.exists(path.resolve(outputInfo.dir, minPath)) && options.useMin) {
                return minPath;
            }
            return filePath;
        }

        function createHTML(filepath, output) {
            var contents = grunt.file.read(filepath);
            var match;
            var successCount = 0, failCount = 0;
            while (match = findInclude(contents)) {
                var pathWithCommand = match.path.split('::'),
                    includePath = pathWithCommand[0],
                    command = pathWithCommand[1];
                var fragmentPath = path.join(options.fragmentPath, includePath);
                if (grunt.file.exists(fragmentPath)) {
                    contents = contents.replace(match.content, getReplaceHTML(fragmentPath, command, output));
                    successCount++;
                } else {
                    contents = contents.replace(match.content, '');
                    failCount++;
                }
            }
            grunt.log.writeln('==>Replace:' + filepath + '(' + successCount + ' succeed,' + failCount + ' failed.)');
            var $ = cheerio.load(contents, {decodeEntities: false});

            var i,
                scripts = $('script'), styles = $('link'),
                scriptArr = [], styleArr = [];
            //除去重复引用的script文件
            var source;
            for (i = 0; i < scripts.length; i++) {
                var script = $(scripts[i]);
                source = script.attr('src');
                if (scriptArr.indexOf(source) >= 0) {
                    script.remove();
                } else {
                    scriptArr.push(source);
                    if (source) {
                        script.attr('src', getMinPath(source, output));
                    }

                }
            }
            //除去重复引用的style文件
            for (i = 0; i < styles.length; i++) {
                var style = $(styles[i]);
                source = style.attr('href');
                if (styleArr.indexOf(source) >= 0) {
                    style.remove();
                } else {
                    styleArr.push(source);
                    //在head中引用css样式
                    $('head').append(style);
                    if (source) {
                        style.attr('href', getMinPath(source, output));
                    }

                }
            }
            return $.html();
        }

        function findInclude(string) {
            var regex = /<!--\s*@@include\s*[= ]\s*(\S+)\s*(?:([^-]+)\s*)?-->/;
            var match = string.match(regex);
            return match ? {
                content: match[0],
                path: match[1]
            } : null;

        }

        // Iterate over all specified file groups.
        this.files.forEach(function (f) {
            // Concat specified files.
            f.src.filter(function (filepath) {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            }).map(function (filepath) {
                // Read file source.
                var outPath = path.join(f.dest, path.basename(filepath));
                var content = createHTML(filepath, outPath);
                // Print a success message.
                return grunt.file.write(outPath, content, {encoding: 'utf-8'});
            });
        });
    });

};
