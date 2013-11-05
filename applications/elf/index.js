jQuery(document).ready(function() {

    function getURLParameter(name) {
        var re = name + '=' + '([^&]*)(&|$)', value = RegExp(re).exec(location.search);
        if (value && value.length && value.length > 1) {
            value = value[1];
        }
        if (value) {
            return decodeURI(value);
        }
        return null;
    }

    var lang = getURLParameter('lang');
    Oskari.setLang(lang || 'fi');
    Oskari.setLoaderMode('dev');
    var appSetup, appConfig;

    /*if( getURLParameter('ts') ) {
     Oskari.setInstTs(getURLParameter('ts'));
     } else {
     Oskari.setInstTs('DEV');
     } */

    var downloadConfig = function(notifyCallback) {
        jQuery.ajax({
            type : 'GET',
            dataType : 'json',
            url : 'config.json',
            beforeSend : function(x) {
                if (x && x.overrideMimeType) {
                    x.overrideMimeType("application/j-son;charset=UTF-8");
                }
            },
            success : function(config) {
                appConfig = config;
                notifyCallback();
            }
        });
    };
    var downloadAppSetup = function(notifyCallback) {
        jQuery.ajax({
            type : 'GET',
            dataType : 'json',
            url : 'appsetup.json',
            beforeSend : function(x) {
                if (x && x.overrideMimeType) {
                    x.overrideMimeType("application/j-son;charset=UTF-8");
                }
            },
            success : function(setup) {
                appSetup = setup;
                notifyCallback();
            }
        });
    };

    var startApplication = function() {
        // check that both setup and config are loaded
        // before actually starting the application
        if (appSetup && appConfig) {
            var app = Oskari.app;
            app.setApplicationSetup(appSetup);
            app.setConfiguration(appConfig);

            console.log(appConfig);

            app.startApplication(function(startupInfos) {
                var sandbox = Oskari.getSandbox();

                /* Let's load WMTS layers from WMTS Caps document */
                var layerService = sandbox.getService('Oskari.mapframework.service.MapLayerService'), wmts = Oskari.clazz.create('Oskari.mapframework.wmts.service.WMTSLayerService', layerService);

                /*wmts.readWMTSCapabilites('statkart.no', 'statkart-wmts.xml', 'EPSG:3035', function () {
                 sandbox.postRequestByName('AddMapLayerRequest', ['elf_basemap', true]);
                 });
                 wmts.readWMTSCapabilites('ELF', 'elf-wmts.xml', 'LAEA');*/

                var appConfigElf = appConfig.elf || {
                    "conf" : {
                        "WMTS" : [{
                            "id" : "statkart.no",
                            "resource" : "statkart-wmts.xml",
                            "TileMatrixSet" : "EPSG:3035",
                            "baseLayer" : "elf_basemap"
                        }, {
                            "id" : "ELF",
                            "resource" : "elf-wmts.xml",
                            "TileMatrixSet" : "LAEA"
                        }]
                    }

                };

                var wmtsLayerSources = appConfigElf.conf.WMTS;

                if (!wmtsLayerSources || !wmtsLayerSources.length) {
                    return;
                }

                var wlen = wmtsLayerSources.length;

                for (var w = 0; w < wlen; w++) {
                    var wobj = wmtsLayerSources[w], wid = wobj.id, wresource = wobj.resource, wtilematrixset = wobj.TileMatrixSet, wbasemap = wobj.baseLayer;

                    var wmtsScope = wobj;
                    wmts.readWMTSCapabilites(wid, wresource, wtilematrixset, function() {

                        if (this.baseLayer) {
                            var sandbox = Oskari.getSandbox();
                            sandbox.postRequestByName('AddMapLayerRequest', [this.baseLayer, true]);
                        }

                    }, {
                        scope : wmtsScope
                    });

                }

            });
        }
    };
    downloadAppSetup(startApplication);
    downloadConfig(startApplication);

});

