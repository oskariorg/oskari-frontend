describe('Test Suite for Promote bundle, including service and Flyout', function() {
    var appSetup = null,
        appConf = null,
        module = null,
        sandbox = null;

    before(function() {

        appSetup = getStartupSequence(['openlayers-default-theme', 'mapfull', 'divmanazer', 'toolbar', 'promote']);

        var mapfullConf = getConfigForMapfull();
        // overwrite test wide appConf
        appConf = {
            "mapfull": mapfullConf,
            "toolbar": {
                "state": {

                },
                "conf": {
                    "history": false,
                    "basictools": false,
                    "viewtools": false
                }
            },
            "promote": {
                "conf": {
                    "title": {
                        "fi": "Otsikko tileen",
                        "en": "Title for Tile"
                    },
                    "desc": {
                        "fi": "Voit käyttää julkaisutoimintoa kirjauduttuasi palveluun.",
                        "en": "You need to log in before using the embedding function."
                    },
                    "signup": {
                        "fi": "Kirjaudu sisään",
                        "en": "Log in"
                    },
                    "signupUrl": {
                        "fi": "/web/fi/login",
                        "en": "/web/en/login"
                    },
                    "register": {
                        "fi": "Rekisteröidy",
                        "en": "Register"
                    },
                    "registerUrl": {
                        "fi": "/web/fi/login?p_p_id=58&p_p_lifecycle=1&p_p_state=maximized&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&saveLastPath=0&_58_struts_action=%2Flogin%2Fcreate_account",
                        "en": "/web/en/login?p_p_id=58&p_p_lifecycle=1&p_p_state=maximized&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&saveLastPath=0&_58_struts_action=%2Flogin%2Fcreate_account"
                    },
                    "toolbarButtons": {
                        "buttonGrp": {
                            "buttonId": {
                                "iconCls": "tool-reset",
                                "tooltip": {
                                    "fi": "jee",
                                    "en": "jee en"
                                }
                            }
                        }
                    }
                }
            }
        };
    });

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
            module = sandbox.findRegisteredModuleInstance('Promote');
            done();
        });
    };

    describe('Promote bundle tile and flyout handling', function() {

        before(startApplication);

        after(teardown);

        it('should setup correctly Promote', function() {

            // Verify handles exist and have the functionality under test
            expect(sandbox).to.be.ok();
            expect(module).to.be.ok();
            expect(module.getName()).to.be('Promote');
        });

        it('should hava a promote tile', function() {
            var tile = module.plugins['Oskari.userinterface.Tile'];
            expect(tile).to.be.ok();
            expect(jQuery("#toolbar .toolrow .tool").length).to.equal(1);
        });

        it('should show the promote description', function() {
            var flyout = module.plugins['Oskari.userinterface.Flyout'];
            expect(flyout).to.be.ok();

            var title = jQuery(".oskari-flyout-title p");
            expect(title.length).to.equal(1);
            // unfortunately language specific title.fi
            expect(title.html()).to.equal(appConf.promote.conf.title.fi);

            var desc = jQuery("div.promoteDescription");
            // unfortunately language specific title.fi
            expect(desc.html()).to.equal(appConf.promote.conf.desc.fi);

        });

    });


});