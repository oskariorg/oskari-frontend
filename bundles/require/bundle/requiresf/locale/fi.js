define(["oskari"], function(Oskari) {
    return Oskari.registerLocalization({
        "lang" : "fi",
        "key" : "requiresf",
        "value" : {
            "title" : "require (singlefile)",
            "desc" : "",
            "tile" : {
                "title" : "require-SF"
            },
            "flyout" : {
                "title" : "require (singlefile)",
                "message" : "require based 'classic' implementation with all parts in a single file. introducing ui, flyout, tile, event and request handling",
                "clickToRequest" : {
                	"button" : "Click to issue a request",
                	"text" : "Request from Other bundle"
                },         
                
                "mapmove" : "Map Moved to",
                "eventReceived" : "Event received"
            }
        }
    });
});