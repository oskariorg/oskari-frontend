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

Note! npm doesn't support Cygwin environment so you might be better off installing in windows prompt.
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

## Building a version of Openlayers 3

Run command:

	npm run build-ol3

Note! You must have java.exe in $PATH for building ol3 successfully.
