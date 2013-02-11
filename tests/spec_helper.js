// Enable for development testing, disable for real backend testing
var development = false;

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