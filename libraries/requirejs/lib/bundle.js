( function() {

    //Helper function to parse the 'N?value:value:value'
    //format used in the resource name.
    function parse(req,name) {
        var parts = name.split('#');
        var path = parts[0];
        var bundleinstancename = parts[1];
        var pathParts = path.split('/');
        var bundlename = pathParts[pathParts.length-1];
        var bundlePath = req.toUrl(pathParts.slice(0,pathParts.length-1).join('/')+"/");
        
        var def = {
            "bundleinstancename" : bundleinstancename,
            "bundlename" : bundlename,
            "instanceProps" : {  },
            "metadata" : {
                "Import-Bundle" : {
                },
                "Require-Bundle-Instance" : []
            }
        };
        def.metadata["Import-Bundle"][bundlename] = {
            "bundlePath" : bundlePath
        };
            
        
        return def;
    }

    //Main module definition.
    define({       
        load : function(name, req, onload, config) {
            var def = parse(req,name);
            req(['oskari'], function(Oskari) {
            
                Oskari.bundle_facade.playBundle(def,function(bi){
                   onload(bi); 
                });
            
            });
        }
    });

}());
