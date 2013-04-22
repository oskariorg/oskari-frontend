describe.only('Test Suite for digiroad/featureselector bundle', function() {
    var appSetup = null,
        appConf = null,
        sandbox = null,
        module = null,
        testLayer = null;

    var testLayerId = 'vaylatyyppi';

    before(function() {

        appSetup = getStartupSequence(['openlayers-default-theme', 'mapfull', 'divmanazer', 'toolbar', 'digiroad-featureselector']);
        appSetup.mapfull.metadata['Import-Bundle']['digiroad-featureselector'] = {
            "bundlePath": "../packages/digiroad/bundle/"
        };

        var mapfullConf = getConfigForMapfull();
        mapfullConf.conf.layers.push({
            "type": "wmslayer",
            "id": "vaylatyyppi",
            "wmsName": "LiVi:LIIKENNE_ELEMENTTI",
            "name": "Väylätyyppi",
            "inspire": "Liikenne-elementit",
            "orgName": "Liikenne-elementit",
            "minScale": 15000000,
            "maxScale": 1,
            "wmsUrl": "http://digiroad.karttakeskus.fi/dgeoserver/wms",
            "styles": [
              {"title": "Väylätyyppi", "name": "vaylatyyppi"}
            ],
            "style": "vaylatyyppi"
        });

        // overwrite test wide appConf
        appConf = {
            "mapfull": mapfullConf,
            "featureselector": {
                "state": {},
                "conf": {
                    "queryUrl": "http://digiroad.karttakeskus.fi/delegate/proxy/wfs",
                    "targetLayers": {
                        "vaylatyyppi": {
                            "objectId": "OID_TUNNUS",
                            "geometryName": "GEOMETRY",
                            "headers": [
                                {"id": "vaylatyyppi", "name": "Väylätyyppi", "field": "VAYLATYYPP", "editor": "select"},
                                {"id": "toiminnallinen_luokka", "name": "Toiminnallinen luokka", "field": "TOIMINNALL", "editor": "select"},
                                {"id": "nimi1_fi", "name": "Nimi (suomi)", "field": "NIMI1_SU", "editor": "text"},
                                {"id": "nimi1_sv", "name": "Nimi (ruotsi)", "field": "NIMI1_RU", "editor": "text"}
                            ]
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
            // Find handles to sandbox and stats bundle.
            sandbox = Oskari.getSandbox();
            module = sandbox.findRegisteredModuleInstance('FeatureSelector');
            testLayer = sandbox.findMapLayerFromAllAvailable(testLayerId);

            done();
        });
    };

    describe('initialization', function() {
        before(startApplication);

        after(teardown);

        it('should be defined', function() {
            expect(sandbox).to.be.ok();
            expect(module).to.be.ok();
        });
    });
});