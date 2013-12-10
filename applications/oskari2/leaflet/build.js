require.config({
  baseUrl: "../../../",
  paths: {
    oskari: "src/oskari/oskari",
    "oskari-with-loader": "src/oskari/oskari-with-loader",
    jquery: "empty:",
    "jquery-migrate": "libraries/jquery/jquery-migrate-1.2.1-modified",
    mainConfig: "applications/oskari2/leaflet/mainConfig",
    css: "libraries/requirejs/lib/css",
    text: "libraries/requirejs/lib/text",
    json: "libraries/requirejs/lib/json",
    domReady: "libraries/requirejs/lib/domReady",
    normalize: "libraries/requirejs/lib/normalize",
    'css-builder': "libraries/requirejs/lib/css-builder"
  },
  map: {
    // '*' means all modules will get 'jquery-private'
    // for their 'jquery' dependency.
    "*": {
      "jquery": "jquery-migrate",
      "map": "src/oskari/bundle/map-leaflet/module",
      "mapmodule-plugin": "src/leaflet/bundle/mapmodule-plugin/module",
      "mapfull": "src/leaflet/bundle/mapfull/module"
    },
    // 'jquery-private' wants the real jQuery module
    // though. If this line was not here, there would
    // be an unresolvable cyclic dependency.
    'jquery-migrate': {
      'jquery': 'jquery'
    },
  },
  optimize: "none",
  optimizeAllPluginResources: true,
  findNestedDependencies: true,
  name: "applications/oskari2/leaflet/main-dev",
  out: "main.js"
});