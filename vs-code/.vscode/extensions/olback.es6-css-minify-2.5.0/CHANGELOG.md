# 2.5.0
* Implemented JSON minification. See #54.

## 2.4.0
* Implemented Autoprefixer as requested in Issue#59. This can be enabled in the config.

## 2.3.0
* Implemented 'Minify selection' as requested by @dwelle in issue#56.

## 2.2.0
* Implemented postfix. [See this PR](https://github.com/olback/es6-css-minify/pull/51)

## 2.1.0
* You no longer have to run `Minify: Reload config` when updating your config. It's done automatically.
* Hide Minify button when the filetype isn't supported. This can be enable by changing `es6-css-minify.hideButton` to `true`.
* Use [terser](https://www.npmjs.com/package/terser) instead of uglify-es since it's deprecated. (#46)
* Inform the user when Javascript minify fails about syntax errors. (#45)

## 2.0.3
* Merged PR #36
* Fixed bug #35

## 2.0.2
* Added some tests.
* You can no longer minify minified files

## 2.0.1
* Fixed bug #28

## 2.0.0
* Rewritten in Typescript
* Fixed bugs #24, #26, #27
* Changed default value of `es6-css-minify.minifyOnSave` to `no`

## 0.1.6
* Added feature from issue #23
* Changed default value of `es6-css-minify.minifyOnSave` to `exists`

## 0.1.5
* Fixed issue #19

## 0.1.4
* Reference original file in sourcemap instead of minified file

## 0.1.3
* Fixed issue #18 (Windows)

## 0.1.2
* Fixed js sourcemap url #16
* Sourcemap sources fixed #15

## 0.1.1
* Added "exists" as an option to `es6-css-minify.minifyOnSave`
* Change the JavaScript Mapping URL. `es6-css-minify.jsMapUrl`

## 0.1.0
* Source map support. Enable/Disable in settings

## 0.0.11
* Fixed bug #10

## 0.0.10
* README changes

## 0.0.9
* Added support for uglify-es and clean-css config files!

## 0.0.8
* Attempt two on fixing the issue!

## 0.0.7
* Failed attempt to fix the plugin

## 0.0.6
* Minify JS on save bug fixed

## 0.0.5
* Typo

## 0.0.4
* Fixed issue #5
* Added support for minify on save
* Settings

## 0.0.3
* Fixed issue #3

## 0.0.2
* Fixed issue #1

## 0.0.1
* Initial release!
