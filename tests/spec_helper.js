// Enable for development testing, disable for real backend testing
var development = true;

// fix expect.js fail error
expect.Assertion.prototype.fail = function (msg) { 
	msg = msg || "explicit failure";
	this.assert(false, function(){ return msg }, function(){ return msg });    
	return this;
};

// waitFor variables from Jasmine https://github.com/pivotal/jasmine/blob/master/src/core
var isCommonJS = typeof window == "undefined" && typeof exports == "object";
expect.TIMEOUT_INCREMENT = 10;


/**
* From Jasmine https://github.com/pivotal/jasmine/blob/master/src/core/base.js
* Waits for the latchFunction to return true before proceeding to the callback.
*
* @param {Function} latchFunction
* @param {String} optional_timeoutMessage
* @param {Number} optional_timeout
**/
function waitsFor(waitCondition, callback, timeoutMessage, timeout) {
	if (waitCondition()) {
		return callback();
	} else if (timeout > 0){
		setTimeout(function() {
			waitsFor(waitCondition, callback, timeoutMessage, (timeout-expect.TIMEOUT_INCREMENT));
		}, expect.TIMEOUT_INCREMENT);
	} else {
		return expect().fail(timeoutMessage);
	}
};
if (isCommonJS) exports.waitsFor = waitsFor;

// Dependeny on map-full should be explicit to avoid defects
// Improve, when there is a real test case that benefits from moving the map to a specific position
//function moveMapTo(north, east, zoom) {
//	Oskari.$("sandbox").postRequestByName('MapMoveRequest', [north,east, zoom]);
//}
//if (isCommonJS) exports.moveMapTo = moveMapTo;

function simulateMouseClick(map, x, y) {
	map.events.triggerEvent("mousemove", {xy: new OpenLayers.Pixel(x, y)});
	map.events.triggerEvent("mousedown", {xy: new OpenLayers.Pixel(x, y)});
	map.events.triggerEvent("mouseup", {xy: new OpenLayers.Pixel(x, y)});
}
if (isCommonJS) exports.simulateMouseClick = simulateMouseClick;

function simulateMouseDblClick(map, x, y) {
	map.events.triggerEvent("mousemove", {xy: new OpenLayers.Pixel(x, y)});
	map.events.triggerEvent("dblclick", {xy: new OpenLayers.Pixel(x, y)});
}
if (isCommonJS) exports.simulateMouseDblClick = simulateMouseDblClick;

function setupOskari(appSetup, appConf, done) {
	// Setup lang
	Oskari.setLang('fi');
	// Set Oskari to use preloaded, for some reason loaderMode also has to be dev for it to work
	Oskari.setLoaderMode('dev');
	Oskari.setPreloaded(true);
	// Switch off async as testing is a bit easier, look below at startApplication for async test example
	Oskari.setSupportBundleAsync(false);

	// Setup variables and init core
	var app = Oskari.app,
		started = false,
		core = Oskari.clazz.create('Oskari.mapframework.core.Core');
//			sandbox = core.getSandbox();
//			sandbox.enableDebug();
	core.init([], []);

	// Setup Oskari App with provided appSetup
	app.setApplicationSetup(appSetup);
	app.setConfiguration(appConf);

	// Start Oskari App
	app.startApplication(function() {
		done();
	});
};

var _defaultsStartupSeq = {
	'divmanazer': {
        "instanceProps": {

        },
        "title": "Oskari DIV Manazer",
        "bundleinstancename": "divmanazer",
        "fi": "Oskari DIV Manazer",
        "sv": "?",
        "en": "Oskari DIV Manazer",
        "bundlename": "divmanazer",
        "metadata": {
            "Import-Bundle": {
                "divmanazer": {
                    "bundlePath": "packages/framework/bundle/"
                }
            },
            "Require-Bundle-Instance": [

            ]
        }
    },
	'openlayers-default-theme' : {
        "instanceProps": {

        },
        "title": "OpenLayers",
        "bundleinstancename": "openlayers-default-theme",
        "fi": "OpenLayers",
        "sv": "?",
        "en": "OpenLayers",
        "bundlename": "openlayers-default-theme",
        "metadata": {
            "Import-Bundle": {
                "openlayers-default-theme": {
                    "bundlePath": "../../../packages/openlayers/bundle/"
                },
                "openlayers-single-full": {
                    "bundlePath": "../../../packages/openlayers/bundle/"
                },
                "oskariui": {
                    "bundlePath": "../../../packages/framework/bundle/"
                }
            },
            "Require-Bundle-Instance": [

            ]
        }
    },
    "mapfull" : {
        "instanceProps": {

        },
        "title": "Map",
        "bundleinstancename": "mapfull",
        "fi": "Map",
        "sv": "?",
        "en": "Map",
        "bundlename": "mapfull",
        "metadata": {
            "Import-Bundle": {
                "service-base": {
                    "bundlePath": "../../../packages/framework/bundle/"
                },
                "event-map-layer": {
                    "bundlePath": "../../../packages/framework/bundle/"
                },
                "request-map-layer": {
                    "bundlePath": "../../../packages/framework/bundle/"
                },
                "mapmodule-plugin": {
                    "bundlePath": "../../../packages/framework/bundle/"
                },
                "event-base": {
                    "bundlePath": "../../../packages/framework/bundle/"
                },
                "mapfull": {
                    "bundlePath": "../../../packages/framework/bundle/"
                },
                "core-base": {
                    "bundlePath": "../../../packages/framework/bundle/"
                },
                "request-base": {
                    "bundlePath": "../../../packages/framework/bundle/"
                },
                "domain": {
                    "bundlePath": "../../../packages/framework/bundle/"
                },
                "core-map": {
                    "bundlePath": "../../../packages/framework/bundle/"
                },
                "oskariui": {
                    "bundlePath": "../../../packages/framework/bundle/"
                },
                "request-map": {
                    "bundlePath": "../../../packages/framework/bundle/"
                },
                "sandbox-base": {
                    "bundlePath": "../../../packages/framework/bundle/"
                },
                "service-map": {
                    "bundlePath": "../../../packages/framework/bundle/"
                },
                "sandbox-map": {
                    "bundlePath": "../../../packages/framework/bundle/"
                },
                "event-map": {
                    "bundlePath": "../../../packages/framework/bundle/"
                }
            },
            "Require-Bundle-Instance": [

            ]
        }
    }
}

var _mapfullConfig = {
    "state": {
        "selectedLayers": [{
            "id": "base_35"
        }],
        "zoom": 1,
        "east": "517620",
        "north": "6874042"
    },
    "conf": {
        "globalMapAjaxUrl": "/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=2&",
        "plugins": [{
            "id": "Oskari.mapframework.bundle.mapmodule.plugin.LayersPlugin"
        }, {
            "id": "Oskari.mapframework.mapmodule.WmsLayerPlugin"
        }, {
            "id": "Oskari.mapframework.mapmodule.MarkersPlugin"
        }, {
            "id": "Oskari.mapframework.mapmodule.ControlsPlugin"
        }, {
            "id": "Oskari.mapframework.bundle.mapwfs.plugin.wfslayer.WfsLayerPlugin"
        }, {
            "id": "Oskari.mapframework.bundle.mapmodule.plugin.ScaleBarPlugin"
        }, {
            "id": "Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar"
        }, {
            "id": "Oskari.mapframework.bundle.mapmodule.plugin.PanButtons"
        }],
        "layers": [{
            "type": "base",
            "id": "base_35",
            "name": "Taustakartta",
            "permissions" : {
            	"publish":"publication_permission_ok"
        	},
            "subLayer": [{
                "wmsName": "taustakartta_5k",
                "type": "wmslayer",
                "id": 184,
                "minScale": 5000,
                "wmsUrl": "http://a.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://b.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://c.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://d.karttatiili.fi/dataset/taustakarttasarja/service/wms",
                "maxScale": 1
            }, {
                "wmsName": "taustakartta_10k",
                "type": "wmslayer",
                "id": 185,
                "minScale": 25001,
                "wmsUrl": "http://a.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://b.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://c.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://d.karttatiili.fi/dataset/taustakarttasarja/service/wms",
                "maxScale": 5001
            }, {
                "wmsName": "taustakartta_20k",
                "type": "wmslayer",
                "id": 186,
                "minScale": 40001,
                "wmsUrl": "http://a.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://b.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://c.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://d.karttatiili.fi/dataset/taustakarttasarja/service/wms",
                "maxScale": 25000
            }, {
                "wmsName": "taustakartta_40k",
                "type": "wmslayer",
                "id": 187,
                "minScale": 2,
                "wmsUrl": "http://a.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://b.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://c.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://d.karttatiili.fi/dataset/taustakarttasarja/service/wms",
                "maxScale": 1
            }, {
                "wmsName": "taustakartta_80k",
                "type": "wmslayer",
                "id": 188,
                "minScale": 56702,
                "wmsUrl": "http://a.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://b.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://c.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://d.karttatiili.fi/dataset/taustakarttasarja/service/wms",
                "maxScale": 40000
            }, {
                "wmsName": "taustakartta_160k",
                "type": "wmslayer",
                "id": 189,
                "minScale": 141742,
                "wmsUrl": "http://a.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://b.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://c.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://d.karttatiili.fi/dataset/taustakarttasarja/service/wms",
                "maxScale": 56702
            }, {
                "wmsName": "taustakartta_320k",
                "type": "wmslayer",
                "id": 190,
                "minScale": 283474,
                "wmsUrl": "http://a.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://b.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://c.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://d.karttatiili.fi/dataset/taustakarttasarja/service/wms",
                "maxScale": 141742
            }, {
                "wmsName": "taustakartta_800k",
                "type": "wmslayer",
                "id": 191,
                "minScale": 566939,
                "wmsUrl": "http://a.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://b.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://c.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://d.karttatiili.fi/dataset/taustakarttasarja/service/wms",
                "maxScale": 283474
            }, {
                "wmsName": "taustakartta_2m",
                "type": "wmslayer",
                "id": 192,
                "minScale": 1417333,
                "wmsUrl": "http://a.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://b.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://c.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://d.karttatiili.fi/dataset/taustakarttasarja/service/wms",
                "maxScale": 566939
            }, {
                "wmsName": "taustakartta_4m",
                "type": "wmslayer",
                "id": 193,
                "minScale": 2834657,
                "wmsUrl": "http://a.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://b.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://c.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://d.karttatiili.fi/dataset/taustakarttasarja/service/wms",
                "maxScale": 1417333
            }, {
                "wmsName": "taustakartta_8m",
                "type": "wmslayer",
                "id": 194,
                "minScale": 15000000,
                "wmsUrl": "http://a.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://b.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://c.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://d.karttatiili.fi/dataset/taustakarttasarja/service/wms",
                "maxScale": 2834657
            }],
            "orgName": "Taustakartta",
            "inspire": "Taustakartta"
        }],
        "imageLocation": "/Oskari/resources"
    }
};



function getStartupSequence(dependencyArray) {
	// ['divmanazer', 'mapfull']
	var appsetup = { startupSequence : [] };
	
	for(var i = 0, ilen = dependencyArray.length; i < ilen; i++) {
		var bundle = dependencyArray[i];
		if(typeof bundle !== 'object') {
			// not object == bundlename -> get default block for bundle
			bundle = _defaultsStartupSeq[bundle];
		}
		appsetup.startupSequence.push(jQuery.extend(true, {}, bundle));
	}
	return appsetup;
}
function getConfigForMapfull() {
	return jQuery.extend(true, {}, _mapfullConfig);
	//return _mapfullConfig.clone();
}

function printDebug(msg) {
    if(window.console) {
        console.log(msg);
    }
}

function removeLayers(module, idList) { 
    var sandbox = module.getSandbox();
    printDebug(sandbox);
    printDebug(idList);
    // remove selected layer
    var rbRemove = sandbox.getRequestBuilder('RemoveMapLayerRequest');
    if(idList) {
        for(var i = 0; i < idList.length; ++i) {
            sandbox.request(module, rbRemove(idList[i]));
        }
    }
    else {
        var selectedLayers = sandbox.findAllSelectedMapLayers();
        for(var i = 0; i < selectedLayers.length; ++i) {
            sandbox.request(module, rbRemove(selectedLayers[i].getId()));
        }
    }
    return sandbox.findAllSelectedMapLayers();
};

function addLayers(module, idList) {
    // remove selected layer
    var sandbox = module.getSandbox();
    var rbAdd = sandbox.getRequestBuilder('AddMapLayerRequest');
    if(idList) {
        for(var i = 0; i < idList.length; ++i) {
            sandbox.request(module, rbAdd(idList[i], true));
        }
    }
    return sandbox.findAllSelectedMapLayers();
};

function getDummyUser() {
	return {
	    "lastName": "Dummy",
	    "nickName": "TestDummy",
	    "userUUID": "325325-235325-235235-abcde",
	    "firstName": "Test",
	    "loginName": "TestCrashDummy"
	};
}

function getDefaultHTML() {
	return '<nav id="maptools"><div id="loginbar"></div><div id="menubar"></div><div id="divider"></div><div id="toolbar"></div></nav><div id="contentMap"><div id="mapdiv"></div></div>';
}

if (isCommonJS) exports.getStartupSequence = getStartupSequence;
if (isCommonJS) exports.getConfig = getConfig;
if (isCommonJS) exports.getDefaultHTML = getDefaultHTML;