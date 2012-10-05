var Oskari = {};
Oskari.clazz = {};
Oskari.bundle_manager = {};
Oskari.bundle_manager.installBundleClass = function() {};
Oskari.clazz.define = function(name, con, meth, meta) {
  for (var s in meta.source.scripts) {
    print(s + '\t' + meta.source.scripts[s].type);
    print('\t' + meta.source.scripts[s].src);
  }
};
