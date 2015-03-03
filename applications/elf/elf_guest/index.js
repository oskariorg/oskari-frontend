/**
 * Start when dom ready
 */
jQuery(document).ready(function() {

    if(!ajaxUrl) {
        alert('Ajax URL not set - cannot proceed');
        return;
    }

    // populate url with possible control parameters
    var getAppSetupParams = {};
    if( typeof window.controlParams == 'object') {
        for(var key in controlParams) {
            getAppSetupParams[key] = controlParams[key];
        }
    }
    if (!language) {
        // default to english
        language = 'en';
    }
    Oskari.setLang(language);
    Oskari.setLoaderMode('dev');
    Oskari.setPreloaded(preloaded);

    // TODO: this code doesn't belong here, move it to some inherited bundle or something
    function startELFSettingsCallback(appConfigElf) {
        var sandbox = Oskari.getSandbox();

        /* temporary fix to ELF WMTS services not working properly zoomed out - forcing minScale on layers */
        Oskari.clazz.category('Oskari.mapframework.wmts.service.WMTSLayerService', 'fix', {
                parseCapabilitiesToLayers : function(wmtsName, caps, matrixSet) {
                    var me = this;
                    var mapLayerService = this.mapLayerService;
                    var getTileUrl = null;
                    if(caps.operationsMetadata.GetTile.dcp.http.getArray) {
                        getTileUrl = caps.operationsMetadata.GetTile.dcp.http.getArray;
                    } else {
                        getTileUrl = caps.operationsMetadata.GetTile.dcp.http.get;
                    }
                    var capsLayers = caps.contents.layers;
                    var contents = caps.contents;
                    var matrixSet = contents.tileMatrixSets[matrixSet];
                    var layersCreated = [];

                    for(var n = 0; n < capsLayers.length; n++) {

                        var spec = capsLayers[n],
                        mapLayerId = spec.identifier,
                        mapLayerSysId = mapLayerId.split('.').join('_'),
                        mapLayerName = spec.identifier,
                        layerExtraInfo =  appConfigElf.conf.layers ? appConfigElf.conf.layers[mapLayerSysId]||{}: {},
                        minScale =  layerExtraInfo.minScale,
                        metadataid = layerExtraInfo.metadataid,
                        mapLayerJson = {
                          wmtsName : mapLayerId,
                          descriptionLink : "",
                          orgName : wmtsName,
                          type : "wmtslayer",
                          legendImage : "",
                          formats : {
                            value : "text/html"
                          },
                          isQueryable : true,
                          minScale : minScale,
                          style : "",
                          dataUrl : "",
                          name : mapLayerId,
                          title : spec.title,
                          opacity : 100,
                          inspire : wmtsName,
                          maxScale : 1
                        };

                    var layer = Oskari.clazz.create('Oskari.mapframework.wmts.domain.WmtsLayer');

                    layer.setAsNormalLayer();
                    layer.setId(mapLayerSysId);
                    layer.setName(mapLayerJson.title);
                    layer.setWmtsName(mapLayerJson.wmtsName);
                    layer.setOpacity(mapLayerJson.opacity);
                    layer.setMaxScale(mapLayerJson.maxScale);
                    layer.setMinScale(mapLayerJson.minScale);
                    layer.setDescription(mapLayerJson.info);
                    layer.setDataUrl(mapLayerJson.dataUrl);
                    layer.setOrganizationName(mapLayerJson.orgName);
                    layer.setInspireName(mapLayerJson.inspire);
                    layer.setWmtsMatrixSet(matrixSet)
                    layer.setWmtsLayerDef(spec);
                    layer.setVisible(true);
                    layer.setMetadataIdentifier(metadataid);

                    layer.addWmtsUrl(getTileUrl);

                    var styleBuilder = Oskari.clazz.builder('Oskari.mapframework.domain.Style');

                    var styleSpec;

                    for(var i = 0, ii = spec.styles.length; i < ii; ++i) {
                        styleSpec = spec.styles[i];
                        var style = styleBuilder();
                        style.setName(styleSpec.identifier);
                        style.setTitle(styleSpec.identifier);

                        layer.addStyle(style);
                        if(styleSpec.isDefault) {
                            layer.selectStyle(styleSpec.identifier);
                            break;
                        }
                    }

                    mapLayerService.addLayer(layer, false);
                    layersCreated.push(layer);

                }
            }
        });     

        /* TEMPORARY: */
        /* Let's load WMTS layers from WMTS Caps documents defined in ELF.json */
        var layerService = sandbox.getService('Oskari.mapframework.service.MapLayerService'), 
        	wmts = Oskari.clazz.create('Oskari.mapframework.wmts.service.WMTSLayerService', layerService);

        var wmtsLayerSources = appConfigElf.conf.WMTS;
        if(wmtsLayerSources )  {
          var wlen = wmtsLayerSources.length;

          for(var w = 0; w < wlen; w++) {
            var wobj = wmtsLayerSources[w], wid = wobj.id, 
            	wresource = wobj.resource, wtilematrixset = wobj.TileMatrixSet, wbasemap = wobj.baseLayer;

            var wmtsScope = wobj;
            wmts.readWMTSCapabilites(wid, wresource, wtilematrixset, function() {
                var sandbox = Oskari.getSandbox();

                if(this.baseLayer) {
                    sandbox.postRequestByName('AddMapLayerRequest', [this.baseLayer, true]);
                }

            }, {
                scope : wmtsScope
            });

          }
          
        }
    }

    /**
    * Set ELF languges HACK. Dirty solution, need to be fixed in future.
    * TODO: move these to another palce
    */
    function setELFLanguagesHack(){
        var language = Oskari.getLang();
        if (language === "fi") {
            Oskari.getLocalization('MapModule').plugin.LogoPlugin.layersHeader = "&copy; ELF ja seuraavat tiedontuottajat:";
        } else if (language === "sv") {
            Oskari.getLocalization('MapModule').plugin.LogoPlugin.layersHeader = "&copy; ELF och följande dataproducenter:";
        } else if (language === "en") {
            Oskari.getLocalization('MapModule').plugin.LogoPlugin.layersHeader = "&copy; ELF and listed service providers:";
            /* ELF specific localization adjustments */
            Oskari.registerLocalization(
            {
                "lang": "en",
                "key": "MapModule",
                "value": {
                    "status_update_map": "Loading the map...",
                    "zoombar_tooltip": {
                        "zoomLvl-0": "Background map",
                        "zoomLvl-1": "Country",
                        "zoomLvl-2": "Province",
                        "zoomLvl-3": "",
                        "zoomLvl-4": "Town",
                        "zoomLvl-5": "",
                        "zoomLvl-6": "",
                        "zoomLvl-7": "Part of town",
                        "zoomLvl-8": "",
                        "zoomLvl-9": "",
                        "zoomLvl-10": "Street",
                        "zoomLvl-11": "",
                        "zoomLvl-12": ""
                    },
                    "plugin": {
                        "LogoPlugin": {
                            "terms": "Terms of Use",
                            "dataSources": "Data sources",
                            "layersHeader": "&copy; ELF and listed service providers:",
                            "indicatorsHeader": "Indicators"
                        },
                        "DataSourcePlugin": {
                            "link": "Copyright",
                            "popup": {
                                "title": "Copyright",
                                "content": "NOT TRANSLATED"
                            },
                            "button": {
                                "close": "Close"
                            }
                        },
                        "LayerSelectionPlugin": {
                            "title": "Map layers",
                            "chooseDefaultBaseLayer": "Select the background map"
                        },
                        "SearchPlugin": {
                            "placeholder": "Search location",
                            "search": "Search",
                            "close": "Close search results.",
                            "noresults": "No results found. Please refine your search.",
                            "toomanyresults": "Over 100 results found. Please refine your search.",
                            "column_name": "Name",
                            "column_village": "Municipality",
                            "column_type": "Type"
                        },
                        "GetInfoPlugin": {
                            "title": "Feature Data",
                            "layer": "Map layer",
                            "places": "Features",
                            "description": "Description",
                            "link": "Web address",
                            "name": "Name"
                        },
                        "PublisherToolbarPlugin": {
                            "test": "test",
                            "history": {
                                "reset": "Return to the default view",
                                "back": "Return to the previous view",
                                "next": "Move to the next view"
                            },
                            "measure": {
                                "line": "Measure a distance",
                                "area": "Measure an area"
                            }
                        },
                        "MarkersPlugin": {
                            "buttons": {
                                "add": "Map marker",
                                "clear": "Delete all markers"
                            },
                            "form": {
                                "title": "Point feature style",
                                "tooltip": "",
                                "symbol": {
                                    "label": "Icon"
                                },
                                "size": {
                                    "label": "Size"
                                },
                                "color": {
                                    "label": "Colour",
                                    "labelOr": "or",
                                    "labelCustom": "Custom colour (RGB 0-255)"
                                },
                                "preview": {
                                    "label": "Preview"
                                },
                                "message": {
                                    "label": "The text on the map",
                                    "hint": "Write a text to be shown on the map."
                                }
                            },
                            "dialog": {
                                "title": "Map marker",
                                "message": "Select a new location for the marker by clicking the map."
                            }
                        }
                    }
                }
            });
    
            Oskari.registerLocalization(
                {
                    "lang": "en",
                    "key": "catalogue.bundle.metadataflyout",
                    "value": {
                        "title": "Metadata",
                        "desc": "",
                        "loader": {
                            "json": "/catalogue/portti-metadata-printout-service/MetadataServlet?",
                            "abstract": "/geonetwork/srv/en/metadata.show.portti.abstract?",
                            "inspire": "/geonetwork/srv/en/metadata.show.portti?",
                            "jhs": "/geonetwork/srv/en/metadata.show.portti.jhs158?",
                            "pdf": "/catalogue/portti-metadata-printout-service/MetadataPrintoutServlet?lang=sv&title=METADATAPRINTOUT&metadataresource",
                            "xml": "/geonetwork/srv/en/iso19139.xml?",
                            "schemas": "/geonetwork/srv/en/metadata.show.portti.skeemat?"
                        },
                        "layer": {
                            "name": "Metadata",
                            "description": "",
                            "orgName": "Metadata catalogue",
                            "inspire": "Metadata"
                        },
                        "flyout": {
                            "title": "Metadata",
                            "abstract": "Basic information",
                            "inspire": "Inspire metadata",
                            "jhs": "ISO 19115 metadata",
                            "xml": "ISO 19139 XML file",
                            "map": "Geographic extent",
                            "pdf": "Printout",
                            "select_metadata_prompt": "Select metadata by clicking the icons.",
                            "metadata_printout_title": "METADATA PRINTOUT",
                            "linkto": "Link to this metadata",
                            "tabs": {
                                "abstract": {
                                    "abstract": "",
                                    "jhs": "Show ISO 19115 metadata",
                                    "inspire": "Show INSPIRE metadata",
                                    "xml": {
                                        "text": "Open ISO 19139 XML file",
                                        "target": "_blank"
                                    },
                                    "pdf": {
                                        "text": "Open PDF printout",
                                        "target": "_blank"
                                    }
                                },
                                "jhs": {
                                    "abstract": "Show basic information",
                                    "jhs": "",
                                    "inspire": "Show INSPIRE metadata",
                                    "xml": {
                                        "text": "Open ISO 19139 XML file",
                                        "target": "_blank"
                                    },
                                    "pdf": {
                                        "text": "Open metadata in PDF printout",
                                        "target": "_blank"
                                    }
                                },
                                "inspire": {
                                    "abstract": "Show basic information",
                                    "jhs": "Show ISO 19115 metadata",
                                    "inspire": "",
                                    "xml": {
                                        "text": "Open ISO 19139 XML file",
                                        "target": "_blank"
                                    },
                                    "pdf": {
                                        "text": "Open metadata in PDF printout",
                                        "target": "_blank"
                                    }
                                }
                            }
                        },
                        "tile": {
                            "title": "Metadata",
                            "tooltip": "The terms of use and the availability of the dataset are documented in the metadata description."
                        }
                    }
                }
            );
        }
    }

    /* let's start some ELF specific ops - config and loading of WMTS capabilities from XML */
    function startELF(sb) {
        setELFLanguagesHack();
        jQuery.ajax({
            type : 'GET',
            dataType : 'json',
            url : "/Oskari/applications/elf/ELF.json",
            success : function(appConfigElf) {
                startELFSettingsCallback(appConfigElf);
            },
            error : function(jqXHR, textStatus) {
                if(jqXHR.status != 0) {
                    jQuery('#mapdiv').append('Unable to start');
                }
            }
        });
    }

 
    /* let's start the app after config has been loaded successfully */
    function start(appSetup, appConfig, cb) {
        var app = Oskari.app;


        /*elf hack, drop indexmap from the list of available tools*/
        if (!appConfig.publisher || !appConfig.publisher.conf || !appConfig.publisher.conf.tools) {
	        appConfig.publisher.conf.tools = elfPublisherAllowedToolsHack();
        }

        app.setApplicationSetup(appSetup);

        // TODO: move to DB!
        appConfig.userguide.conf = {
            "flyoutClazz": "Oskari.mapframework.bundle.userguide.SimpleFlyout"
        };

        app.setConfiguration(appConfig);
        app.startApplication(function(startupInfos) {
            var instance = startupInfos.bundlesInstanceInfos.mapfull.bundleInstance;
            if(cb) {
                cb(instance);
            }
        });
    }

    /**
    * Nasty hack to remove index map from the list of allowed tools in elf. TODO: add these to db
    */
    function elfPublisherAllowedToolsHack() {
		return [{
            id: 'Oskari.mapframework.bundle.mapmodule.plugin.ScaleBarPlugin',
            selected: false,
            lefthanded: 'bottom left',
            righthanded: 'bottom right',
            config: {
                location: {
                    top: '',
                    right: '',
                    bottom: '',
                    left: '',
                    classes: 'bottom left'
                }
            }
        }, {
            id: 'Oskari.mapframework.bundle.mapmodule.plugin.PanButtons',
            selected: false,
            lefthanded: 'top left',
            righthanded: 'top right',
            config: {
                location: {
                    top: '',
                    right: '',
                    bottom: '',
                    left: '',
                    classes: 'top left'
                }
            }
        }, {
            id: 'Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar',
            selected: true,
            lefthanded: 'top left',
            righthanded: 'top right',
            config: {
                location: {
                    top: '',
                    right: '',
                    bottom: '',
                    left: '',
                    classes: 'top left'
                }
            }
        }, {
            id: 'Oskari.mapframework.bundle.mapmodule.plugin.MyLocationPlugin',
            selected: false,
            lefthanded: 'top left',
            righthanded: 'top right',
            config: {
                location: {
                    top: '',
                    right: '',
                    bottom: '',
                    left: '',
                    classes: 'top left'
                }
            }
        }, {
            id: 'Oskari.mapframework.bundle.mapmodule.plugin.SearchPlugin',
            selected: false,
            lefthanded: 'top right',
            righthanded: 'top left',
            config: {
                location: {
                    top: '',
                    right: '',
                    bottom: '',
                    left: '',
                    classes: 'top right'
                }
            }
        }, {
            id: 'Oskari.mapframework.mapmodule.ControlsPlugin',
            selected: true
        }, {
            id: 'Oskari.mapframework.bundle.mapmodule.plugin.PublisherToolbarPlugin',
            selected: false,
            lefthanded: 'top right',
            righthanded: 'top left',
            config: {
                location: {
                    top: '',
                    right: '',
                    bottom: '',
                    left: '',
                    classes: 'top right'
                },
                toolbarId: 'PublisherToolbar'
            }
        }, {
            id: 'Oskari.mapframework.mapmodule.GetInfoPlugin',
            selected: true,
            config: {
                ignoredLayerTypes: ['WFS'],
                infoBox: false
            }
        }];

    }

    /* let's load the appsetup and configurations from database */
    jQuery.ajax({
        type : 'POST',
        dataType : 'json',
        data : getAppSetupParams,
        url : ajaxUrl + 'action_route=GetAppSetup',
        success : function(app) {
            if(app.startupSequence && app.configuration) {
                var appSetup = {
                    "startupSequence" : app.startupSequence
                };
                start(appSetup, app.configuration, function(instance) {
                    startELF();
                });
            } else {
                jQuery('#mapdiv').append('Unable to start');
            }
        },
        error : function(jqXHR, textStatus) {
            if(jqXHR.status != 0) {
                jQuery('#mapdiv').append('Unable to start');
            }
        }
    });

});   