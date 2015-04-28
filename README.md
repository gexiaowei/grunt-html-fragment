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

#### options.separator
Type: `String`
Default value: `',  '`

A string value that is used to do something with whatever.

#### options.punctuation
Type: `String`
Default value: `'.'`

A string value that is used to do something else with whatever else.

### Usage Examples
```html
<!-- @@include= head.html::div->addClass->title,div->addClass->name -->
```
It means include head.html to the html with command $('div').addClass('title') and $('div').addClass('name')
'::' means it has command, 
if you just do not want use command, you can use like that:
```html
<!-- @@include= head.html -->
```

#### Default Options
In this example, the default options are used to do something with whatever. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result would be `Testing, 1 2 3.`

```js
grunt.initConfig({
  html_fragment: {
    options: {},
    files: {
      'dest/': ['src/123.html'],
    },
  },
});
```

#### Custom Options
In this example, custom options are used to do something else with whatever else. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result in this case would be `Testing: 1 2 3 !!!`

```js
grunt.initConfig({
  html_fragment: {
    options: {
      fragmentPath: 'fragment/'
    },
    files: {
      'dest/': ['src/123.html'],
    },
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
0.1.2 remove the style and script which is repetitive
0.1.1 add @@include and ::(with jquery command);