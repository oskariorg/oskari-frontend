require.config({
    baseUrl: "../../../libraries/requirejs/lib",
    paths: {
        _libraries_ : '../..',      
        _bundles_ : '../../../bundles',
        _applications_ : '../../../applications',
        _resources_ : '../../../resources',
        mainConfig: "../../../applications/oskari2/full-map_guest/mainConfig",
        jquery: "empty:",
        "jquery-migrate": "../../jquery/jquery-migrate-1.2.1-modified"
    },
    map: {
      // '*' means all modules will get 'jquery-private'
      // for their 'jquery' dependency.
      '*': { 'jquery': 'jquery-migrate' },

      // 'jquery-private' wants the real jQuery module
      // though. If this line was not here, there would
      // be an unresolvable cyclic dependency.
      'jquery-migrate': { 'jquery': 'jquery' }
    },
    optimize: "none",
    optimizeAllPluginResources: true,
    findNestedDependencies: true,
    name: "../../../applications/oskari2/full-map_guest/main-dev",
    out: "../../../applications/oskari2/full-map_guest/main.js"
});