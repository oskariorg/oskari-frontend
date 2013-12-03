require.config({
  baseUrl: "/Oskari/", // the base is set to requirejs lib to help requiring 3rd party libs
  paths: { // some path shortcuts to ease declarations
    oskari: "src/oskari/oskari",
    "oskari-with-app": "src/oskari/oskari-with-app",
    "oskari-with-loader": "src/oskari/oskari-with-loader",
    jquery: "http://code.jquery.com/jquery-1.9.1",
    "jquery-migrate": "libraries/jquery/jquery-migrate-1.2.1-modified",
    css: "libraries/requirejs/lib/css",
    json: "libraries/requirejs/lib/json",
    domReady: "libraries/requirejs/lib/domReady",
    text: "libraries/requirejs/lib/text",
    i18n: "libraries/requirejs/lib/i18n",
    normalize: "libraries/requirejs/lib/normalize"
  },
  map: {
    // '*' means all modules will get 'jquery-private'
    // for their 'jquery' dependency.
    "*": {
      "oskari": "oskari-with-app",
      "jquery": "jquery-migrate",
      "map": "src/oskari/map-ol2/module",
      "mapmodule-plugin": "src/ol2/mapmodule-plugin/module",
      "mapfull": "src/ol2/mapfull/module",
      "divmanazer": "src/framework/divmanazer/module",
      "toolbar": "bundles/framework/bundle/toolbar/module",
      "statehandler": "bundles/framework/bundle/statehandler/module",
      "infobox": "bundles/framework/bundle/infobox/module",
      "search": "bundles/framework/bundle/search/module",
      "layerselector2": "bundles/framework/bundle/layerselector2/module",
      "layerselection2": "src/framework/layerselection2/module",
      "personaldata": "bundles/framework/bundle/personaldata/module",
      "maplegend": "bundles/framework/bundle/maplegend/module",
      "userguide": "bundles/framework/bundle/userguide/module",
      "backendstatus": "bundles/framework/bundle/backendstatus/module",
      "postprocessor": "bundles/framework/bundle/postprocessor/module",
      "publisher": "bundles/framework/bundle/publisher/module",
      "guidedtour": "src/framework/guidedtour/module",
      "statsgrid": "src/statistics/statsgrid/module",
      "promote": "bundles/framework/bundle/promote/module"
    },

    // 'jquery-private' wants the real jQuery module
    // though. If this line was not here, there would
    // be an unresolvable cyclic dependency.
    "jquery-migrate": {
      "jquery": "jquery"
    }
  },
  shim: {
    "oskari": {
      exports: "Oskari"
    }
  },
  config: {
    i18n: {
      locale: language
    }
  },
  waitSeconds: 30
});