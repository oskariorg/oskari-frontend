##Select with options

Replacement for `select` element that works with browsers (like Internet Explorer, including IE11) that don't support templates (including `dom-repeat`) inside ```<select>``` tags.
See Polymer issue [#1735](https://github.com/Polymer/polymer/issues/1735).

## Quick start

Several quick start options are available:

* [Download the latest release](https://github.com/vehikl/polymer-select-with-options/archive/master.zip).
* Clone the repo: `git clone https://github.com/vehikl/polymer-select-with-options.git`.
* Install with [Bower](http://bower.io): `bower install polymer-select-with-options`.

### What's included

For an existing Polymer project, only the `select-with-option.html` file is required to be imported. The remaining files are for use in the demo.

```
├── README.md
├── bower.json
├── demo.html
├── polymer-micro.html
├── polymer-mini.html
├── polymer.html
└── select-with-options.html
```

## Usage

Import `select-with-options.html` into your project;

```
<link rel="import" href="select-with-options.html">
```

This component supports data-binding an array of String, an array of Objects as well as hard coded options.

###Array of Strings

Simply bind an array of strings to the 'options' attribute. The array values will be mapped to both 'value' and 'label'.

```
<select is="select-with-options" options="{{options}}" value="{{value::change}}"></select>
```

###Array of Objects

If you supply an array of objects there are additional parameters to specify which object properties to map as the `value` and `label` (`option-value` and `option-label`).

```
<select is="select-with-options" options="{{options}}" option-value="id" option-label="name" value="{{value::change}}"></select>
```

###Hard coded options

Just like a standard `select` element, you can provide hard-coded ```<option>``` tags, which are displayed before those provided in the `options` attribute.

```
<select is="select-with-options" options="{{options}}" option-value="id" option-label="name" value="{{value::change}}">
    <option value="hardcoded_option">Hardcoded Option</option>
</select>
```

## Demo

Live preview available [here](http://vehikl.github.io/polymer-select-with-options/). Source for demo is available in `demo.html` 
