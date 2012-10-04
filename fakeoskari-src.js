var Oskari = {};
Oskari.bundle_manager = {};
Oskari.bundle_manager.installBundleClass = function() {};
Oskari.clazz = {};
Oskari.clazz.metadata = function() {};
Oskari.clazz.define = function(name, con, meth, meta) {
    if (!(meta.source && meta.source.scripts)) {
	return;
    }
    for (var s in meta.source.scripts) {
	var script = meta.source.scripts[s];
	if (script.type === "text/javascript" &&
	    script.src.substring(0, 7) !== "http://" &&
	    script.src.substring(0, 8) !== "https://") {
	    print(script.src);
	}
    }
};
