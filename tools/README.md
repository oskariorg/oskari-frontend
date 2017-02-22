# Usage notes for tools

Install with

	npm install

If you are behind corporate proxy, configure npm and prompt with proxy settings:

	npm config set proxy http://domain:port
	npm config set https-proxy http://domain:port

For windows command prompt:

	set HTTP_PROXY=http://domain:port
	set HTTPS_PROXY=http://domain:port

For Linux/OSX:

	export http_proxy=http://domain:port
	export https_proxy=https://domain:port

Note! npm doesn't support Cygwin environment so you might be better off installing in windows prompt. Also check windows PATH environment variable so at the Windows installed Git cmd folder is previously than cygwin bin folder (if these are wrong order npm install also can fail).
Running Grunt etc after install works correctly on Cygwin also.

## Building a minified release for Oskari application

Using default settings (using application applications/sample/servlet and timestamp as version) run:

	npm run build

Using selected version ('VER') and application ('applications/NAMESPACE/APPLICATION') run:

	./node_modules/.bin/grunt release:VER:../applications/NAMESPACE/APPLICATION/minifierAppSetup.json

## Testing code with JSHint

Run command:

	npm run lint

This tests everything under 'bundles' directory

## Trimming trailing spaces from code

Run command:

	npm run trim

## Building the Oskari core

Run command:

	npm run core

Generates a new version of file Oskari/bundles/bundle.js

## Localization

### Generate excel-sheets of current bundle-localizations

1) Run command in /Oskari/tools:

For all locales:

	npm run oskari2excel

For selected locales:

	./node_modules/.bin/grunt genL10nExcels --locale="en,fi,sv"

2) Generated excels are located under /Oskari/dist/L10N

### Read excel into locale-file

1) Run command in /Oskari/tools:

	npm run excel2oskari

### Clean localization files

1) Run command in /Oskari/tools:

	npm run clean-l10n

Removes all NOT TRANSLATED values from the localization files. This makes minified code to use the values from english localization.

*WARNING! If a localization file has more than one Oskari.registerLocalization() call the tool WILL BREAK the file. It will only include the latest one.*

## Building a version of Openlayers 3

Run command:

	npm run build-ol3

Note! You must have java.exe in $PATH for building ol3 successfully.

### Custom build

Build configuration files are located under tools/conf/ol3. To create custom build, change the file names in build script (tools/tasks/buildOskariOL3.js) to ol-custom.json and ol-custom-debug.json, or create your own configuration file.
