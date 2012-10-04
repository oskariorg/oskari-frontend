var Oskari = {};
Oskari.clazz = {};
Oskari.bundle_manager = {};
Oskari.bundle_manager.installBundleClass = function() {};
Oskari.clazz.define = function(name, con, meth, meta) {
    if (!(meta.source && meta.source.locales)) {
	return;
    }
    for (var s in meta.source.locales) {
	var locale = meta.source.locales[s];
	if (locale.type === "text/javascript" &&
	    locale.src.substring(0, 7) !== "http://" &&
	    locale.src.substring(0, 8) !== "https://") {
	    print(locale.src);
	}
    }
};

