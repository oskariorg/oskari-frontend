describe('Test Suite for statistics/publishedgrid bundle', function() {
    var appSetup = null,
        appConf = null,
        publishedGrid = null,
        sandbox = null;

    var testLayerId = 276;

    before(function() {

        appSetup = getStartupSequence(['openlayers-default-theme', 'mapfull', 'publishedgrid']);

        var mapfullConf = getConfigForMapfull();
        mapfullConf.conf.layers.push({
            "id": testLayerId,
            "type": "statslayer",
            "wmsName": "ows:kunnat2013",
            "wmsUrl": "http://nipsuke01.nls.fi:8080/geoserver/ows/wms",
            "maxScale": 1,
            "minScale": 10000000,
            "name": "tilasto testi fi",
            "inspire": "Aluesuunnittelu ja rajoitukset",
            "orgName": "Metsäntutkimuslaitos"
        });

        // overwrite test wide appConf
        appConf = {
            "mapfull": mapfullConf,
            "publishedgrid": {
                "state": {
                    "layerId": testLayerId,
                    "indicators": []
                },
                "conf": {
                    "gridShown": true
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
            // Find handles to sandbox and publishedgrid bundle.
            //sandbox = Oskari.getSandbox();
            //publishedGrid = sandbox.findRegisteredModuleInstance('PublishedGrid');
            done();
        });
    };

    describe('published map', function() {
        before(startApplication);

        after(teardown);

        it('should have publishedgrid bundle defined', function() {
            expect(sandbox).to.be.ok();
            expect(publishedGrid).to.be.ok();
        });
    });
});