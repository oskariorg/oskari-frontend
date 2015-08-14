// Log function calls. Only works in Chrome but could be adapted
// to other browsers by recognizing their stack trace format.
// Call DBGStart() to begin, DBGStop() to stop and DBGDump() to see results.

// Global variables for logging. They're ugly, but this whole
// logging system is a hack that slows the browser down.
var DBGLog;
var DBGList;
var DBGUnknown={};
var DBGStart;
var DBGTracing=false;

/** Start tracing function calls. */
function DBGStart() {
	DBGLog=[];
	DBGList={};
	DBGStart=new Date().getTime();
	DBGTracing=true;
}

/** Stop tracing function calls. */
function DBGStop() {
	DBGTracing=false;
}

/** Call in the beginning of every function to log function calls.
  * @param {number} id   Unique ID for function call, this can be any number.
  * @param {string} name Function name, this can be anything that nicely identifies the function.
  * @param {string} path File where the function is found.
  * @param {number] line Line number where function begins. */
function DBGTrace(id,name,path,line) {
	if(!DBGTracing) return;

	// Throw an exception to get a stack trace with line numbers.
	try {die();}
	catch(ex) {
		var argList,argOutList;
		var argNum,argCount;
		var arg;

		var caller;
		var callNum,callCount;
		var callList;

		var logEntry;
		var pos;

		// If function hasn't been called before, add it to function table.
		if(!DBGList[id]) {
			DBGList[id]={
				name:name,
				path:path,
				line:line
			}
		}

		// Interesting function is the one that called this function (DBGTrace).
		caller=arguments.callee.caller;

		// Get list of arguments and prepare to serialize.
		argOutList=[];
		argList=caller.arguments;

		// Limit number of arguments to 10.
		argCount=argList.length;
		if(argCount>10) {
			argOutList[10]='...';
			argCount=10;
		}

		// Serialize arguments. Primitive data types don't need any changing here.
		for(argNum=0;argNum<argCount;argNum++) {
			arg=argList[argNum];

			switch(typeof(arg)) {
				case 'string':
					if(arg.length>100) {
						argOutList[argNum]=arg.substr(0,100);
						break;
					}
				case 'number':
				case 'boolean':
					argOutList[argNum]=arg;break;
				case 'object':
					argOutList[argNum]=arg?'{'+arg.constructor.name+'}':'null';break;
				default:
					argOutList[argNum]=DBGUnknown;break;
			}
		}

		// Create log entry for this function call.
		logEntry={
			id:id,
			argList:argOutList,
			callerId:null,
			callerRow:null,
			callerCol:null,
			stamp:new Date().getTime()-DBGStart
		};

		// Add entry to log and annotate current function with it, so calls it makes can be bound to it.
		DBGLog.push(logEntry);
		caller.DBG=logEntry;

		// Process stack trace.
		callList=ex.stack.split('\n');
		callCount=callList.length;

		for(callNum=3;callNum<callCount && (caller=caller.caller);callNum++) {
			// Find caller that's been logged already.
			if(caller.DBG) {
				// Extract row and column numbers in source code.
				pos=callList[callNum].match(/:([0-9]*):([0-9]*)\)?$/);

				// Add caller's info to log entry.
				logEntry.callerId=caller.DBG.id;
				logEntry.callerRow=pos[1];
				logEntry.callerCol=pos[2];
				break;
			}
		}
	}
}

/** Dump debug output into a new window with a link to an object URL.
  * Right click on the link to save the dump as text. */
function DBGDump() {
	var wnd;
	var outList;
	var i,l;
	var blob;
	var func,invoc;

	// Open popup. You need to allow the browser to show it.
	wnd=window.open();

	outList=[];
	outList.push('FUNCTIONS\n');

	// Dump function table.
	for(i in DBGList) {
		if(!DBGList.hasOwnProperty(i)) continue;

		func=DBGList[i];
		outList.push(i+'\t'+(func.name.trim() || '?'+func.line)+' @ '+func.path+':'+func.line+'\n');
	}

	outList.push('CALLS\n');

	// Dump call log.
	l=DBGLog.length;
	for(i=0;i<l;i++) {
		invoc=DBGLog[i];
		outList.push(invoc.stamp+'\t'+invoc.id+'\t'+(invoc.callerId || '')+'\t'+(invoc.callerRow || '')+'\t'+(invoc.callerCol || '')+'\t'+invoc.argList.join('\t')+'\n');
	}

	// Create a link and add text inside so there's something to click.
	link=wnd.document.createElement('a');
	link.appendChild(wnd.document.createTextNode('data'));

	// Add object URL to link.
	blob=new Blob(outList,{type:'text/plain'});
	link.href=wnd.URL.createObjectURL(blob);

	// Add link to popup window.
	wnd.document.body.appendChild(link);
}
