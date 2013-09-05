require.config({

    /* the base is set to requirejs lib to help requiring 3rd party libs */
    "baseUrl" : "/Oskari/libraries/requirejs/lib",

    /* some path shortcuts to ease declarations */
    paths : {
        _libraries_ : '/Oskari/libraries',    	
        _bundles_ : '/Oskari/bundles',
        _applications_ : '/Oskari/applications',
        _resources_ : '/Oskari/resources',
        jquery: "http://code.jquery.com/jquery-1.9.1",
        "jquery-migrate": "/Oskari/libraries/jquery/jquery-migrate-1.2.1-modified"
    },
    // Add this map config in addition to any baseUrl or
    // paths config you may already have in the project.
    map: {
      // '*' means all modules will get 'jquery-private'
      // for their 'jquery' dependency.
      '*': { 'jquery': 'jquery-migrate' },

      // 'jquery-private' wants the real jQuery module
      // though. If this line was not here, there would
      // be an unresolvable cyclic dependency.
      'jquery-migrate': { 'jquery': 'jquery' }
    },
    config : {
        i18n : {
            locale : language
        }
    }
});