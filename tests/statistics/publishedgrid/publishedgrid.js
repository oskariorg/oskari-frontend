describe('Test Suite for statistics/publishedgrid bundle', function() {
    var appSetup = null,
        appConf = null,
        publishedGrid = null,
        sandbox = null,
        gridConf = {
            "state": {
                "layerId": 276,
                "indicators": [{
                    "indicator": 4,
                    "gender": "total",
                    "year": 2011
                }],
                "methodId": 3,
                "currentColumn": "indicator42011total"
            },
            "conf": {
                "gridShown": true
            }
        };

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
            "publishedgrid": gridConf
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
            sandbox = Oskari.getSandbox();
            publishedGrid = sandbox.findRegisteredModuleInstance('PublishedGrid');
            sandbox._listeners = {};
            done();
        });
    };

    describe('published map', function() {
        before(startApplication);

        after(teardown);

        it('should have publishedgrid bundle defined', function() {
            expect(sandbox).to.be.ok();
            expect(publishedGrid).to.be.ok();
            expect(publishedGrid.gridPlugin).to.be.ok();
            expect(publishedGrid.classifyPlugin).to.be.ok();
        });

        it('should have the grid in the DOM', function() {
            var gridContainer = jQuery('.oskariui-left').find('.publishedgrid');
            expect(gridContainer.length).to.be(1);
        });

        it('should hide the grid when the button is clicked', function(done) {
            var gridContainer = jQuery('.oskariui-left').find('.publishedgrid');
            var hideButton = jQuery('#publishedgridToggle');
            expect(hideButton.length).to.be(1); // Doesn't seem to find this
            // The grid should be visible at first...
            expect(gridContainer.is(':hidden')).to.be(false);
            hideButton.click();
            // Timeouts used because hide/show are animated (duration 50 ms).
            setTimeout(function() {
                // ...then hidden...
                expect(gridContainer.is(':hidden')).to.be(true);
                hideButton.click();
                setTimeout(function() {
                    // ...and then visible again!
                    expect(gridContainer.is(':hidden')).to.be(false);
                    done();
                }, 200);
            }, 100);
        });

        // For one reason or another, this test seems to ask for user credentials
        it('should have indicators in the grid', function() {
            var grid = publishedGrid.gridPlugin.grid,
                columns;

            setTimeout(function() {
                columns = grid.getColumns();
                // The two municipality columns (name + code) and the one in the state.
                expect(columns.length).to.be(3);
            }, 2000);
        });
    });
});
