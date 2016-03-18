# Usage notes for tools

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
