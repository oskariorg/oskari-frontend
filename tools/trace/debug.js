var fs=require('fs');

var fileList;
var fileNum,fileCount;
var funcNum;

// Read list of full paths to .js files requiring instrumentation.
fileList=fs.readFileSync(process.argv[2],'utf-8').split('\n');
fileCount=fileList.length;

// Counter to give each function a unique ID.
funcNum=0;

// Loop through file list.
for(fileNum=0;fileNum<fileCount;fileNum++) {
	funcFirst=funcNum;

	path=fileList[fileNum];
	if(!path) continue;

	// Initialize list of output lines.
	outList=[];
	// Add tracing code to Oskari main bundle.
	if(path=='Oskari/bundles/bundle.js') {
		outList.push(fs.readFileSync('trace.js','utf-8'));
	}

	// Loop through all lines.
	lineList=fs.readFileSync(path,'utf-8').split('\n');
	for(j=0;j<lineList.length;j++) {
		line=lineList[j];

		// Call a tracking function at the beginning of each function.
		// Automatically detect function names.
		line=line.replace(/(?:['"]?([-_0-9A-Za-z]*)['"]? *:)? *function *([-_0-9A-Za-z]*) *\([^)]*\) *{/,function(def,name1,name2) {
			// Take name from after or before "function" keyword,
			// or make up a name based on file name and function ID.
			var name=name2 || name1 || path.match(/([^/.]+)\.[^/.]+$/)[1]+'_'+(funcNum-funcFirst+1);

			// Construct call to tracking function.
			return(def+"DBGTrace("+(funcNum++)+",'"+name+"','"+path+"',"+(j+1)+");");
		});

		// Add line to output.
		outList.push(line);
	}

	// Write modified lines back to source code file.
	fs.writeFileSync(path,outList.join('\n'));
}
