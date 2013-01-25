# README

## Installing

### Install Node

Get node from www.nodejs.org

### Get the dependencies

> npm install

### Move generator/markx.js => node_modules/markx/lib/markx.js

> mv generator/markx.js node_modules/markx/lib/markx.js

## Generating .html documentation

> node generate.js --apiurl "<location>" --docsurl "<location>"

## Writing documentation

Use template.md found in this (docs) directory

## Developing

### Edited Markx lib (\lib\markx.js)

#### Markx

var processTemplate = function(done, options) {
...
    data.menu = options.menu; // OSKARI EDIT: Added new parameter which gives possibility to insert HTML menu
