describe('Test suite for Toolbar bundle', function () {
    var toolbarModule = null,
        sandbox = null,
        appSetup = getStartupSequence(['openlayers-default-theme', 'mapfull', {
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
                    "mapUrlPrefix": {
                        "en": "http://www.paikkatietoikkuna.fi/web/en/map-window?",
                        "fi": "http://www.paikkatietoikkuna.fi/web/fi/kartta?",
                        "sv": "http://www.paikkatietoikkuna.fi/web/sv/kartfonstret?"
                    },
                    "logUrl": "http://localhost:8080/logger"
                }
            }
        };

    function startApplication(done, setup, conf) {
        if (!setup) {
            // clone original settings
            setup = jQuery.extend(true, {}, appSetup);
        }
        if (!conf) {
            // clone original settings
            conf = jQuery.extend(true, {}, appConf);
        }

        //setup HTML
        jQuery("body").html(getDefaultHTML());
        // startup Oskari
        setupOskari(setup, conf, function () {
            // Set supported locales
            Oskari.setSupportedLocales(['fi_FI', 'sv_SE', 'en_US']);
            // Find handles to sandbox and toolbar module
            sandbox = Oskari.getSandbox();
            toolbarModule = sandbox.findRegisteredModuleInstance('Toolbar');
            done();
        });
    };

    describe('initialization', function () {
        var $toolbarContainer;

        before(function (done) {
            startApplication(done);
        });

        after(function() {
            teardown();
        });

        it('should be defined', function() {
            expect(toolbarModule).to.be.ok();
        });

        it('should be found in the DOM', function() {
            $toolbarContainer = toolbarModule.getToolbarContainer();
            expect($toolbarContainer.length).to.equal(1);
        });
    });

    describe('adding tool buttons', function() {
        var testButtonId = 'testButton',
            testButtonGroup = 'testGroup',
            testButtonConf = {
                iconCls: 'test-button-icon',
                tooltip: '',
                sticky: false,
                callback: function() {
                    return false;
                }
            },
            $toolbarContainer;

        before(function(done) {
            startApplication(done);
        });

        after(function() {
            teardown();
        });

        it('should add a tool button', function() {
            toolbarModule.addToolButton(testButtonId, testButtonGroup, testButtonConf);

            $toolbarContainer = toolbarModule.getToolbarContainer();
            var testToolRow = $toolbarContainer.find('div.toolrow[tbgroup=default-' + testButtonGroup + ']');
            var testButton = $toolbarContainer.find('div.tool[tool="' + testButtonId + '"]');

            expect(testToolRow.length).to.equal(1);
            expect(testButton.length).to.equal(1);

            toolbarModule.removeToolButton(testButtonId, testButtonGroup);
        });

        it('should add a disabled tool button', function() {
            testButtonConf.disabled = true;
            toolbarModule.addToolButton(testButtonId, testButtonGroup, testButtonConf);

            $toolbarContainer = toolbarModule.getToolbarContainer();
            var testToolRow = $toolbarContainer.find('div.toolrow[tbgroup=default-' + testButtonGroup + ']');
            var testButton = $toolbarContainer.find('div.tool[tool="' + testButtonId + '"]');

            expect(testToolRow.length).to.equal(1);
            expect(testButton.length).to.equal(1);
            expect(testButton.hasClass('disabled')).to.be(true);

            toolbarModule.removeToolButton(testButtonId, testButtonGroup);
        });

        // FIXME figure out a way to spy on the callback function
        it('should respond to callback when clicked', function() {
            var cbSpy = sinon.spy(testButtonConf, 'callback');
            toolbarModule.addToolButton(testButtonId, testButtonGroup, testButtonConf);

            var testButton = $toolbarContainer.find('div.tool[tool="' + testButtonId + '"]');
            testButton.click();

            expect(cbSpy.callCount).to.be(1);
            cbSpy.restore();

            toolbarModule.removeToolButton(testButtonId, testButtonGroup);
        });
    });
});