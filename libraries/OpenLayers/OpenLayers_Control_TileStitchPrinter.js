/**
 * Class: OpenLayers.Control.TileStitchPrinter
 * The TileStitchPrinter control adds encapsulates the process of collecting tiles
 * from an OpenLayers.Map for submission to a server-side tile-stitching program.
 * For the server-side programs and other discussion of this concept, see
 * http://trac.osgeo.org/openlayers/wiki/Printing
 *
 * This process should work for any OpenLayers.Layer.Grid subclass, and has been tested
 * extensively with Layer.WMS and Layer.MapServer
 * It is known not to work with Layer.Google for both technical and legal reasons.
 *
 * The expected behavior of the printing service is to return the string URL where
 * the finished image can be located. The browser would presumably open a new window
 * to that URL, assign an "src" attribute to a IMG, et cetera. It is NOT expected behavior
 * for the printing service to return the image directly, as AJAX callbacks would
 * effectively ignore the image data entirely.
 *
 * The JSON-encoding functions are taken from json2.js See http://www.JSON.org/js.html
 * Thank you very much.
 *
 * Inherits from:
 *  - <OpenLayers.Control>
 */
OpenLayers.Control.TileStitchPrinter = OpenLayers.Class(OpenLayers.Control, {

	/**
	 * Parameters:
	 * printUrl - {string}
	 *     The URL of the printing server. The JSON-encoded tiles will be POSTed to this URL,
	 *     and that web service should return a string containing the URL of the resulting image.
	 */
	printUrl : "",

	/**
	 * Parameters:
	 * requestImage - {boolean}
	 *     Leave this at the default (false) unless you're sure you have a reason.
	 *     Setting this to true instructs the server not to send the URL of the resulting image,
	 *     but to return image data instead. This is probably not appropriate for AJAX techniques.
	 */
	requestImage : false,

	/**
	 * Method: beforePrint
	 * This method is called before the printing is done.
	 * This is an appropriate place for an alert() notifying the user that it will be a moment,
	 * for displaying a "Please wait" dialog, et cetera.
	 * By default, this empty function does nothing.
	 */
	beforePrint : function() {
	},

	/**
	 * Method: handleResponse
	 *
	 * Parameters:
	 * url - {String} The URL of the finished image.
	 *
	 * This method is called after the printing is done and the URL of the resulting image is had.
	 * This function receives a single parameter: the URL of the resulting image.
	 * This is an appropriate place to open a new window to the image, to clear a "Please wait" dialog, etc.
	 * By default, this empty function does nothing.
	 */
	handleResponse : function(url) {
	},

	/**
	 * Method: handleError
	 *
	 * Parameters:
	 * errortext - {String} The text response from the server.
	 *
	 * This method is called after the printing is done, and the server's response does not look like an image URL.
	 * This is an appropriate place to print an error message or alert.
	 * By default, this empty function does nothing.
	 */
	handleError : function(errortext) {
	},

	/**
	 * Method: print
	 * Call this method to have the control collect tiles and submit them to the printing server.
	 * See also the beforePrint() and handleResponse() methods.
	 */
	print : function() {
		// we can't even think about it, unless we have a printUrl set
		if (!this.printUrl)
			return alert("Error: printUrl must be set in the constructor.");
		// go through all layers, and collect a list of tile objects
		// each tile object is:
		// url - String, the URL of the image showing in that tile
		// x - OpenLayers.Pixel, the X (horizontal) position of the tile's upper-left corner
		// y - OpenLayers.Pixel, the Y (vertical) position of the tile's upper-left corner
		// opacity - Integer, the opacity percentage 1 - 100
		var size = this.map.getSize();
		var tiles = [];
		var offsetX = parseInt(this.map.layerContainerDiv.style.left);
		var offsetY = parseInt(this.map.layerContainerDiv.style.top);
		for (layername in this.map.layers) {
			// if the layer isn't visible at this range, or is turned off, skip it
			var layer = this.map.layers[layername];
			if (!layer.getVisibility || !layer.getVisibility())
				continue;
			if (!layer.calculateInRange())
				continue;
			// iterate through their grid's tiles, collecting each tile's extent and pixel location at this moment
			for (tilerow in layer.grid) {
				for (tilei in layer.grid[tilerow]) {
					var tile = layer.grid[tilerow][tilei]
					if (tile.bounds) {
						var url = layer.getURL(tile.bounds);
						var position = tile.position;
						var tilexpos = position.x + offsetX;
						var tileypos = position.y + offsetY;
						var opacity = layer.opacity ? parseInt(100 * layer.opacity) : 100;
						tiles[tiles.length] = {
							url : url,
							x : tilexpos,
							y : tileypos,
							opacity : opacity
						};
					}
				}
			}
		}

		// hand off the list of tiles to our server-side script, which will do the tile stitching
		var request_image = this.requestImage ? 1 : 0;
		var tiles_json = this.json_encode(tiles);
		this.beforePrint();
		var callback_good = this.handleResponse;
		var callback_bad = this.handleError;
		OpenLayers.Request.POST({
			url : this.printUrl,
			data : OpenLayers.Util.getParameterString({
				width : size.w,
				height : size.h,
				tiles : tiles_json,
				image : request_image
			}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			},
			callback : function(request) {
				var reply = request.responseText;
				if (reply.substr(0, 4) == 'http') {
					callback_good(reply);
				} else {
					callback_bad(reply);
				}
			}
		});
	},

	json_encode : function(value, whitelist) {
		///// some helper functions for the encoding process
		function f(n) {// Format integers to have at least two digits.
			return n < 10 ? '0' + n : n;
		}


		Date.prototype.toJSON = function() {
			// Eventually, this method will be based on the date.toISOString method.
			return this.getUTCFullYear() + '-' + f(this.getUTCMonth() + 1) + '-' + f(this.getUTCDate()) + 'T' + f(this.getUTCHours()) + ':' + f(this.getUTCMinutes()) + ':' + f(this.getUTCSeconds()) + 'Z';
		};

		var m = {// table of character substitutions
			'\b' : '\\b',
			'\t' : '\\t',
			'\n' : '\\n',
			'\f' : '\\f',
			'\r' : '\\r',
			'"' : '\\"',
			'\\' : '\\\\'
		};

		///// finally, on to actually encoding
		var
		a, // The array holding the partial texts.
		i, // The loop counter.
		k, // The member key.
		l, // Length.
		r = /["\\\x00-\x1f\x7f-\x9f]/g, v;
		// The member value.

		switch (typeof value) {
			case 'string':
				// If the string contains no control characters, no quote characters, and no
				// backslash characters, then we can safely slap some quotes around it.
				// Otherwise we must also replace the offending characters with safe sequences.
				return r.test(value) ? '"' + value.replace(r, function(a) {
					var c = m[a];
					if (c) {
						return c;
					}
					c = a.charCodeAt();
					return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
				}) + '"' : '"' + value + '"';

			case 'number':
				// JSON numbers must be finite. Encode non-finite numbers as null.
				return isFinite(value) ? String(value) : 'null';

			case 'boolean':
			case 'null':
				return String(value);

			case 'object':
				// Due to a specification blunder in ECMAScript, typeof null is 'object', so watch out for that case.
				if (!value) {
					return 'null';
				}

				// If the object has a toJSON method, call it, and stringify the result.
				if ( typeof value.toJSON === 'function') {
					return this.json_encode(value.toJSON());
				}
				a = [];
				if ( typeof value.length === 'number' && !(value.propertyIsEnumerable('length'))) {
					// The object is an array. Stringify every element. Use null as a placeholder for non-JSON values.
					l = value.length;
					for ( i = 0; i < l; i += 1) {
						a.push(this.json_encode(value[i], whitelist) || 'null');
					}

					// Join all of the elements together and wrap them in brackets.
					return '[' + a.join(',') + ']';
				}
				if (whitelist) {
					// If a whitelist (array of keys) is provided, use it to select the components of the object.
					l = whitelist.length;
					for ( i = 0; i < l; i += 1) {
						k = whitelist[i];
						if ( typeof k === 'string') {
							v = this.json_encode(value[k], whitelist);
							if (v) {
								a.push(this.json_encode(k) + ':' + v);
							}
						}
					}
				} else {
					// Otherwise, iterate through all of the keys in the object.
					for (k in value) {
						if ( typeof k === 'string') {
							v = this.json_encode(value[k], whitelist);
							if (v) {
								a.push(this.json_encode(k) + ':' + v);
							}
						}
					}
				}

				// Join all of the member texts together and wrap them in braces.
				return '{' + a.join(',') + '}';
		}
	},

	CLASS_NAME : "OpenLayers.Control.TileStitchPrinter"
});
