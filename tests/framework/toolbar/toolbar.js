describe.only('Test suite for Toolbar bundle', function() {
    var toolbarModule = null,
        sandbox = null,
        appSetup = getStartupSequence(['openlayers-default-theme', 'mapfull',
        {
            "instanceProps": {

            },
            "title": "Toolbar",
            "bundleinstancename": "toolbar",
            "fi": "jquery",
            "sv": "?",
            "en": "?",
            "bundlename": "toolbar",
            "metadata": {
                "Import-Bundle": {
                    "toolbar": {
                        "bundlePath": "packages/framework/bundle/"
                    }
                },
                "Require-Bundle-Instance": [

                ]
            }
        }]),
        mapfullConf = getConfigForMapfull(),
        appConf = {
            "mapfull": mapfullConf,
            "toolbar": {
                "state": {},
                "conf": {
                    "logUrl": "http://localhost:8080/logger"
                }
            }
        };

    function startApplication(done, setup, conf) {
        if(!setup) {
            // clone original settings
            setup = jQuery.extend(true, {}, appSetup);
        }
        if(!conf) {
            // clone original settings
            conf = jQuery.extend(true, {}, appConf);
        }

        //setup HTML
        jQuery("body").html(getDefaultHTML());
        // startup Oskari
        setupOskari(setup, conf, function() {
            // Find handles to sandbox and toolbar module
            sandbox = Oskari.getSandbox();
            toolbarModule = sandbox.findRegisteredModuleInstance('Toolbar');
            done();
        });
    };

    describe('initialization', function() {
        before(function(done) {
            startApplication(done);
        });

        it('should be defined', function() {
           expect(toolbarModule).to.be.ok();
        });
    })

    describe('adding tool buttons', function() {
        before(function(done) {
            startApplication(done);
        });

        it('should add a tool button', function() {

        });

        it('should add a disabled tool button', function() {

        });
    });
});