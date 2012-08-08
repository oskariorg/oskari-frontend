/** free software (c) 2009-IV maanmittauslaitos.fi * */
Oskari.clazz.define('Oskari.NLSFI.OpenLayers.Strategy.QueuedTile', function(
		options) {

	var props = {
		/** op not in use */
		op : null,

		/** bounds OpenLayers.Bounds (either bounds or filter) for spatial query */
		bounds : null,

		/** feature used as spatial filter */
		feature : null,

		/** OpenLayers.Filter (either bounds or filter) */
		filter : null,

		/** optional list of qualified query property names */
		propertyNames : null,

		/** tileFeature for tile visualisation only */
		tileFeature : null,

		/** filterType FilterType OpenLayers.Filter.Spatial.*(String) */
		filterType : null
	};

	for (p in props)
		this[p] = props[p];

	this.op = options.op;
	this.filterType = options.filterType ? options.filterType
			: OpenLayers.Filter.Spatial.BBOX;

	this.bounds = options.bounds;
	this.feature = options.feature;
	this.tileFeature = options.tileFeature;
	this.filter = options.filter;
	this.propertyNames = options.propertyNames;

}, {

	/** shallow clone instance of queued tile */
	clone : function() {
		return Oskari.clazz.create(
				'Oskari.NLSFI.OpenLayers.Strategy.QueuedTile', {
					bounds : this.bounds.clone(),
					feature : this.feature,
					tileFeature : this.tileFeature
				});
	},

	CLASS_NAME : "NLSFI.OpenLayers.Strategy.QueuedTile"
});

Oskari.clazz.define('Oskari.NLSFI.OpenLayers.Strategy.TileQueue', function(
		options) {
	this.queue = [];
}, {

	getLength : function() {
		return this.queue.length;
	},

	/** pop a job from mid queue or from top if queue size is less than 4 */
	popJob : function() {
		var q = this.queue;
		var qLength = q.length;
		if (qLength === 0) {
			return null;
		}

		if (qLength < 4) {
			return q.shift(-1);
		}

		var tdef = null;
		var qIndex = Math.floor(qLength / 2);

		tdef = q[qIndex];
		this.queue = q.slice(0, qIndex).concat(q.slice(qIndex + 1));

		return tdef;
	},

	/** push a job as QueuedTile or a json object to queue */
	pushJob : function(obj) {
		this.queue.push(obj);
	},

	/** replace queue with an empty one */
	flushQueue : function() {
		this.queue = [];
	},

	CLASS_NAME : "NLSFI.OpenLayers.Strategy.TileQueue"
});
