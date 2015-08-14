describe('Test Suite for layerselector2 bundle with keyword config', function() {
    var appSetup = null,
        appConf = null,
        statsPlugin = null,
        sandbox = null;

    before(function() {

        appSetup = getStartupSequence([
            'openlayers-default-theme', 
            'mapfull', 
            'divmanazer',
            'toolbar',
            'layerselector2'
            ]);

        var mapfullConf = getConfigForMapfull();
        // overwrite test wide appConf
        appConf = {
            "mapfull": mapfullConf,
            "toolbar": {
                conf: {}
            },
            "layerselector2" : {
              "conf" : {
                "showSearchSuggestions" : true
              }
            }

        };

        //add some initial layers to this test
        addLayers();
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
            // Find handles to sandbox and stats plugin.
            sandbox = Oskari.getSandbox();
            module = sandbox.findRegisteredModuleInstance('LayerSelector');
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
    describe('search in flyout', function() {

        before(startApplication);

        after(teardown);

        it('should open flyout', function(done) {
            expect(jQuery('.oskari-flyout').hasClass('oskari-closed')).to.be(true);

            var titles = jQuery('.oskari-tile-title');
            for (var i = 0; i < titles.length; i++) {
                var title = jQuery(titles[i]);
                if(title.text() === 'Karttatasot') {
                    title.click(); 
                    setTimeout(function() {
                        // ...then visible...
                        expect(jQuery('.oskari-flyout').hasClass('oskari-closed')).to.be(false);
                        done();
                    }, 100);
                }
            };
        });
        it('should show keyword list', function(done) { 
            
            var input = jQuery('.oskarifield input:first');
            var tab = module.plugins['Oskari.userinterface.Flyout'].layerTabs[0];
            // configuration for keyword search should be enabled
            expect(tab.showSearchSuggestions == true).to.be(true);

            var oskarifield = jQuery(tab.filterField.getField());
            oskarifield.find('input').val('testi');

            var doSpy = sinon.stub(tab, '_relatedKeywordsPopup', function(keyword, event, me) {
                event.preventDefault();

                me.sentKeyword = keyword;
                var pResp = [
                    {"id":300,"layers":[],"keyword":"testi","shortcut":false},
                    {"id":301,"layers":[],"keyword":"2testi2","shortcut":false},
                    {"id":250,"layers":[248],"keyword":"laituripaikat","type":"yk","shortcut":false}
                ];
                me.relatedKeywords = pResp;
                me._showRelatedKeywords(keyword, pResp, oskarifield);
            });
            // keywords should not be visible yet
            expect(oskarifield.find('.related-keywords:visible').length).to.be(0);

            var e = jQuery.Event("keypress"); 
            e.which = 13; //choose the one you want 
            e.keyCode = 13;
            oskarifield.find('input').trigger(e);

            oskarifield.find('input').trigger(jQuery.Event("keyup"));
            oskarifield.find('input').trigger(jQuery.Event("change"));
            // Waits for searchFlyout to recieve results
            waitsFor(function() {
              return(doSpy.callCount > 0);
            }, function() {
                expect(doSpy.callCount > 0).to.be(true);
                // now keywords should be visible
                expect(oskarifield.find('.related-keywords:visible').length).to.be(1);
                done();
            }, "Waits for search spied method to be called", 3000);


        });
        // skipped since functionality has changed, popup is no longer shown and keywords are listed differently
        it.skip('should be able to select offered keyword with up and enter', function(done) {
            var input = jQuery('.oskarifield input:first');
            var tab = module.plugins['Oskari.userinterface.Flyout'].layerTabs[0];
            var oskarifield = jQuery(tab.filterField.getField());

            var e = jQuery.Event("keydown");
            e.which = 38; //up
            e.keyCode = 38;
            oskarifield.find('input').trigger(e);

            setTimeout(function() {
                // one keyword should be hilighted (the bottom one)
                expect(oskarifield.find('.focus').length).to.be(1);

                var e = jQuery.Event("keypress");
                e.which = 13; //enter
                e.keyCode = 13;
                oskarifield.find('input').trigger(e);

                setTimeout(function() {
                    // related-keywords should not be in dom
                    expect(oskarifield.find('.related-keywords').length).to.be(1);
                    // search input should contain text laituripaikat
                    expect(oskarifield.find('input').val()).to.be('laituripaikat');
                    done();
                }, 100);
            }, 100);

        });

    });


    var addLayers = function() {
        appConf.mapfull.conf.layers.push({
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
        appConf.mapfull.conf.layers.push({
          "wmsName": "tampere_ora:KIINTOPISTEET",
          "geom": "POLYGON ((315565.40148363647 6815280.632493397, 317986.7418708982 6860823.70644548, 348303.2257153403 6859343.642985682, 346285.52923954977 6813786.636150383, 315565.40148363647 6815280.632493397))",
          "type": "wmslayer",
          "baseLayerId": 23,
          "legendImage": "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=KP_PISTEET_MVIEW",
          "formats": {
            "value": "text/html"
          },
          "id": 147,
          "style": "",
          "dataUrl": "/catalogue/ui/metadata.html?uuid=5395fa72-b053-4fef-aab0-c7c9ab880c91",
          "updated": "Thu Feb 28 10:59:19 EET 2013",
          "name": "Tampereen kiintopisteet",
          "opacity": 100,
          "permissions": {
            "publish": "no_publication_permission"
          },
          "maxScale": 1,
          "inspire": "Koordinaattijärjestelmät",
          "dataUrl_uuid": "5395fa72-b053-4fef-aab0-c7c9ab880c91",
          "styles": {
            "title": "Kiintopistetyyli_uusi",
            "legend": "http://tampere.navici.com:80/tampere_wfs_geoserver/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=KIINTOPISTEET",
            "name": "tre_kiintopiste_uusi"
          },
          "descriptionLink": "",
          "orgName": "Tampereen kaupunki",
          "isQueryable": true,
          "minScale": 80000,
          "wmsUrl": "http://tampere.navici.com/tampere_wfs_geoserver/ows?\n",
          "admin": {
            
          },
          "orderNumber": 790,
          "subtitle": ""
        });
        appConf.mapfull.conf.layers.push({
          "dataUrl_uuid": "",
          "wmsName": "tampere_ora:RAKENNUKSET_MVIEW",
          "styles": {
            "title": "Rakennustyyli",
            "legend": "http://tampere.navici.com:80/tampere_wfs_geoserver/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=RAKENNUKSET_MVIEW",
            "name": "tre_rakennukset"
          },
          "descriptionLink": "",
          "baseLayerId": 23,
          "orgName": "Tampereen kaupunki",
          "type": "wmslayer",
          "legendImage": "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=RAKENNUKSET_MVIEW",
          "formats": {
            "value": "text/html"
          },
          "isQueryable": true,
          "id": 178,
          "minScale": 80000,
          "dataUrl": "",
          "style": "",
          "updated": "Thu May 03 17:04:59 EEST 2012",
          "wmsUrl": "http://wms.w.paikkatietoikkuna.fi/wms/tampere_wfs_geoserver/ows",
          "admin": {
            
          },
          "orderNumber": 800,
          "name": "Tampereen rakennukset",
          "permissions": {
            "publish": "no_publication_permission"
          },
          "opacity": 100,
          "subtitle": "",
          "inspire": "Rakennukset",
          "maxScale": 1
        });
        appConf.mapfull.conf.layers.push({
          "wmsName": "tampere_ora:KI_TRE_OMISTUS_VIEW",
          "type": "wmslayer",
          "baseLayerId": 23,
          "legendImage": "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&amp;format=image%2Fpng&amp;width=20&amp;height=20&amp;layer=KI_TRE_OMISTUS_VIEW",
          "formats": {
            "value": "text/html"
          },
          "id": 219,
          "style": "",
          "dataUrl": "",
          "created": "Mon Feb 20 11:24:39 EET 2012",
          "updated": "Mon Mar 19 16:28:27 EET 2012",
          "name": "Tampereen kaupungin omistamat kiinteistöt",
          "opacity": 100,
          "permissions": {
            "publish": "no_publication_permission"
          },
          "maxScale": 1,
          "inspire": "Kiinteistöt",
          "dataUrl_uuid": "",
          "descriptionLink": "",
          "styles": {
            "title": "Kaavatilannekartan tyyli",
            "legend": "http://tampere.navici.com:80/tampere_wfs_geoserver/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=KI_TRE_OMISTUS_VIEW",
            "name": "tre_omistus"
          },
          "orgName": "Tampereen kaupunki",
          "isQueryable": true,
          "minScale": 80000,
          "wmsUrl": "http://wms.w.paikkatietoikkuna.fi/wms/tampere_wfs_geoserver/ows",
          "admin": {
            
          },
          "orderNumber": 830,
          "subtitle": ""
        });
        appConf.mapfull.conf.layers.push({
          "wmsName": "tampere_iris:WFS_KATUOSA",
          "type": "wmslayer",
          "baseLayerId": 23,
          "legendImage": "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&amp;format=image%2Fpng&amp;width=20&amp;height=20&amp;layer=WFS_KATUOSA",
          "formats": {
            "value": "text/html"
          },
          "id": 245,
          "style": "",
          "dataUrl": "",
          "created": "Thu May 03 16:52:19 EEST 2012",
          "updated": "Thu May 03 17:09:11 EEST 2012",
          "name": "Tampereen katuosa",
          "opacity": 100,
          "permissions": {
            "publish": "no_publication_permission"
          },
          "maxScale": 1,
          "inspire": "Liikenneverkot",
          "dataUrl_uuid": "",
          "descriptionLink": "",
          "styles": {
            "title": "1 px blue line",
            "legend": "http://tampere.navici.com:80/tampere_wfs_geoserver/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=WFS_KATUOSA",
            "name": "line"
          },
          "orgName": "Tampereen kaupunki",
          "isQueryable": true,
          "minScale": 80000,
          "wmsUrl": "http://wms.w.paikkatietoikkuna.fi/wms/tampere_wfs_geoserver/ows",
          "admin": {
            
          },
          "orderNumber": 833,
          "subtitle": ""
        });

    }
});