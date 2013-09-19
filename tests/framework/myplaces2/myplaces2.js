describe('Test Suite for MyPlaces2', function() {
    var module = null,
        sandbox = null,
        appSetup = getStartupSequence(
            [
                'openlayers-default-theme',
                'mapfull',
                'divmanazer',
                'toolbar',
                'myplaces2'
            ]
        ),
        mapfullConf = getConfigForMapfull(),
        appConf = {
            "toolbar": {
                "state": {},
                "conf": {
                    "history": false,
                    "basictools": false,
                    "viewtools": false
                }
            },
            "mapfull": mapfullConf,
            "myplaces2": {
                "conf": {
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
            // Find handles to sandbox and statehandler module
            sandbox = Oskari.$("sandbox");
            module = sandbox.findRegisteredModuleInstance('MyPlacesButtonHandler');
            done();
        });
    };

    describe('initialization', function() {
        before(startApplication);
        after(teardown);

        it('should be defined', function() {
            expect(sandbox).to.be.ok();
            expect(module).to.be.ok();
            expect(module.getName()).to.be('MyPlacesButtonHandler');
        });

        it("should add buttons to toolbar", function() {
            expect(jQuery("#toolbar .toolrow .tool").length).to.equal(3);
        });
    });

    describe('localizations', function() {
        before(startApplication);
        after(teardown);

        it("should have same structure for fi, sv and en", function() {
            var result = matchLocalization('MyPlaces2', ['fi', 'sv', 'en']);
            expect(result).to.be(true);
        });
    });
});
