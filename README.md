# grunt-html-fragment

> A plugin for combine fragments with template into a new html file. It also with clean the style and script which is repetitive in the new html file.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-html-fragment --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-html-fragment');
```

## The "html_fragment" task

### Overview
In your project's Gruntfile, add a section named `html_fragment` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  html_fragment: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.fragmentPath
Type: `String`
Default value: `'fragment'`

A string value that is used to get all the fragment files.

#### options.needReplacePath
Type: `Boolean`
Default value: `true`

A boolean value that is used to decided whether replace the relative source link that.

#### options.pathDefined
Type: `Array`
Default value: `[]`

A array value that is used to add your custom tag which has relative source link. you should push Object has tag and attr value like {tag:'tag',attr:'attr'}

#### options.absoluteHeads
Type: `Array`
Default value: `[]`

A array value that is used to mark the source link start with.


### Usage Examples
```html
<!-- @@include= head.html::div->addClass->title,div->addClass->name -->
```
It means include head.html to the html with command $('div').addClass('title') and $('div').addClass('name')

'::' means it has command. 

If you just do not want use command, you can use like that:
```html
<!-- @@include= head.html -->
```

#### Options
In this example, the default options are used to replace tag with fragment in test. it will create new html based on 'test/fixtures/123.html' and which named '123.html' into 'dest' directory.

```js
grunt.initConfig({
  options: {
    fragmentPath:'test/fragment'
  },
  html_fragment: {
    files: {
      'dest/': ['test/fixtures/123.html'],
    },
  }
});
```

## Contributing
In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
0.1.7 add a function about replace relative path;

0.1.5 fixed some bugs;

0.1.3 remove the style and script which is repetitive;

0.1.1 add @@include and ::(with jquery command);