describe.skip('Test Suite for Featuredata2', function() {
    var module = null,
        sandbox = null,
        appSetup = getStartupSequence(
            [
                'openlayers-default-theme',
                'mapfull',
                'divmanazer',
                'toolbar',
                'featuredata2'
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
            "featuredata2": {
                "conf": {
                    "selectionTools": true
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

        // from GetMapLayers, check the JSON response in Firebug to select layer
        conf.mapfull.conf.layers.push({
            "wmsName": "palvelupisteiden_kyselypalvelu",
            "type": "wfslayer",
            "baseLayerId": 27,
            "legendImage": "",
            "formats": {},
            "id": 216,
            "style": "<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?>\n<StyledLayerDescriptor version=\"1.0.0\" xmlns=\"http://www.opengis.net/sld\" xmlns:ogc=\"http://www.opengis.net/ogc\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"http://www.opengis.net/sld http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd\">\n\t<NamedLayer>\n\t\t<Name>Palvelupisteet</Name>\n\t\t<UserStyle>\n\t\t\t<Title>Palvelupisteiden tyyli</Title>\n\t\t\t<Abstract/>\n\t\t\t<FeatureTypeStyle>\n\t\t\t\t<Rule>\n\t\t\t\t\t<Title>Piste</Title>\n\t\t\t\t\t<PointSymbolizer>\n\t\t\t\t\t\t<Graphic>\n\t\t\t\t\t\t\t<Mark>\n\t\t\t\t\t\t\t\t<WellKnownName>circle</WellKnownName>\n\t\t\t\t\t\t\t\t<Fill>\n\t\t\t\t\t\t\t\t\t<CssParameter name=\"fill\">#FFFFFF</CssParameter>\n\t\t\t\t\t\t\t\t</Fill>\n\t\t\t\t\t\t\t\t<Stroke>\n\t\t\t\t\t\t\t\t\t<CssParameter name=\"stroke\">#000000</CssParameter>\n\t\t\t\t\t\t\t\t\t<CssParameter name=\"stroke-width\">2</CssParameter>\n\t\t\t\t\t\t\t\t</Stroke>\n\t\t\t\t\t\t\t</Mark>\n\t\t\t\t\t\t\t<Size>12</Size>\n\t\t\t\t\t\t</Graphic>\n\t\t\t\t\t</PointSymbolizer>\n\t\t\t\t</Rule>\n\t\t\t</FeatureTypeStyle>\n\t\t</UserStyle>\n\t</NamedLayer>\n</StyledLayerDescriptor>",
            "dataUrl": "",
            "created": "Wed Jan 18 14:11:29 EET 2012",
            "updated": "Mon Mar 05 12:20:59 EET 2012",
            "name": "Palvelupisteiden kyselypalvelu",
            "opacity": 100,
            "permissions": {
                "publish": "no_publication_permission"
            },
            "maxScale": 1,
            "inspire": "Yleishyödylliset ja muut julkiset palvelut",
            "dataUrl_uuid": "",
            "descriptionLink": "",
            "styles": {},
            "orgName": "Valtiokonttori",
            "isQueryable": false,
            "minScale": 50000,
            "wmsUrl": "wms",
            "admin": {},
            "orderNumber": 2,
            "subtitle": ""
        });

        //setup HTML
        jQuery("body").html(getDefaultHTML());

        // startup Oskari
        setupOskari(setup, conf, function() {
            // Find handles to sandbox and statehandler module
            sandbox = Oskari.$("sandbox");
            module = sandbox.findRegisteredModuleInstance('FeatureData2');
            done();
        });
    };

    describe('initialization', function() {
        before(startApplication);
        after(teardown);

        it('should be defined', function() {
            expect(sandbox).to.be.ok();
            expect(module).to.be.ok();
            expect(module.getName()).to.be('FeatureData2');
        });

        it("should add buttons to toolbar", function() {
            expect(jQuery("#toolbar .toolrow .tool").length).to.equal(1);
        });
    });

    describe('localizations', function() {
        before(startApplication);
        after(teardown);

        it("should have same structure for fi, sv and en", function() {
            var result = matchLocalization('FeatureData2', ['fi', 'sv', 'en']);
            expect(result).to.be(true);
        });
    });
});
