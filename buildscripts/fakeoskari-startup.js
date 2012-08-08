var jQuery = function() {
    var foo = {};
    foo.ready = function() {};
    return foo;
};

var document = "foobiebletch";

var Oskari = {};
Oskari.clazz = {};
Oskari.bundle_manager = {};
Oskari.bundle_manager.installBundleClass = function() {};
Oskari.clazz.define = function(name, con, meth, meta) {
    if (!(meth.appSetup && meth.appSetup.startupSequence)) {
	return;
    }
    var i = 0;
    for (var p in meth.appSetup.startupSequence) {
	i++;
	var phase = meth.appSetup.startupSequence[p];
	for (var b in phase.metadata["Import-Bundle"]) {
	    print(i + " " + phase.metadata["Import-Bundle"][b].bundlePath + b);
	}
    }
};
