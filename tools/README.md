# Usage notes for tools

## Trimming trailing spaces from code

Run command: 
	
	npm run trim

## Localization 

### Generate excel-sheets of current bundle-localizations

1) Run command in /Oskari/tools:

	./node_modules/.bin/grunt genL10nExcels --locale="en,fi,sv" 

2) Generated excels are located under /Oskari/dist/L10N

### Read excel into locale-file

1) Run command in /Oskari/tools:

	./node_modules/.bin/grunt impL10nExcels --pattern=../dist/L10N/{lang}/{bundleid}_{lang}.xlsx
