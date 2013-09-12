require.config({
    "baseUrl" : "/Oskari/libraries/requirejs/lib", // the base is set to requirejs lib to help requiring 3rd party libs
    paths : { // some path shortcuts to ease declarations
        _libraries_ : '/Oskari/libraries',    	
        _bundles_ : '/Oskari/bundles',
        _applications_ : '/Oskari/applications',
        _resources_ : '/Oskari/resources',
        jquery: "http://code.jquery.com/jquery-1.9.1",
        "jquery-migrate": "/Oskari/libraries/jquery/jquery-migrate-1.2.1-modified"
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
    shim: {
      'oskari' : {
        exports: 'Oskari'
      }
    },
    config : {
        i18n : {
            locale : language
        }
    }
});