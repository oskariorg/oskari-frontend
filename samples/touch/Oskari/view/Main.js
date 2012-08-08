

Oskari.clazz.define('Oskari.framework.oskari.Touch', function() {

}, {

	/**
	 * 
	 */

	/**
	 * @method start
	 * 
	 */
	start : function(cb) {

		if (location.search.indexOf('oskariLoaderMode=yui') != -1) {
			Oskari.setLoaderMode('yui');
		}
		if (location.search.indexOf('oskariLoaderAsync=on') != -1) {
			Oskari.setSupportBundleAsync(true);
		}

		var me = this;
		var frameworkBundlePath = '../framework/bundle/';

		/**
		 * Let's start bundle named 'sample-1'
		 */

		var def = {
			title : 'Map',
			fi : 'Map',
			sv : '?',
			en : 'Map',
			bundlename : 'touch',
			bundleinstancename : 'touch',
			metadata : {
				"Import-Bundle" : {
					"core-base" : {
						bundlePath : frameworkBundlePath
					},
					"core-map" : {
						bundlePath : frameworkBundlePath
					},
					"sandbox-base" : {
						bundlePath : frameworkBundlePath
					},
					"sandbox-map" : {
						bundlePath : frameworkBundlePath
					},
					"event-base" : {
						bundlePath : frameworkBundlePath
					},

					"event-map" : {
						bundlePath : frameworkBundlePath
					},
					"request-base" : {
						bundlePath : frameworkBundlePath
					},
					"request-map" : {
						bundlePath : frameworkBundlePath
					},
					"service-base" : {
						bundlePath : frameworkBundlePath
					},
					"service-map" : {
						bundlePath : frameworkBundlePath
					},
					"common" : {
						bundlePath : frameworkBundlePath
					},
					"mapmodule-plugin" : {
						bundlePath : frameworkBundlePath
					},
					"domain" : {
						bundlePath : frameworkBundlePath
					},
					"runtime" : {
						bundlePath : frameworkBundlePath
					},
					"layers" : {
						bundlePath : 'bundle/'
					},
					"openlayers-map" : {
						bundlePath : '../openlayers/bundle/'
					},
					/*
					 * "minimal" : { bundlePath : '../example-bundles/bundle/' }
					 */

					"touch" : {
						bundlePath : 'bundle/'
					},
					"yui" : {
						bundlePath : '../tools/bundle/'
					}

				},

				/**
				 * A list of bundles to be started
				 */
				"Require-Bundle-Instance" : []

			},
			instanceProps : {

			}
		};

		/** use sample bundle to fire the engine * */
		Oskari.bundle_facade.playBundle(def, cb);
	}
}

);



Ext.define('Oskari.view.Main', {
	extend : 'Ext.Panel',
	requires : [ 'Ext.dataview.NestedList', 'Ext.NavigationBar' ],
	config : {
		fullscreen : true,
		layout : {
				type: 'fit'//,
						  /*animation: { type: 'slide', direction: 'left',
						  duration: 250 */
					
						 
		},
		items : [{
			id : 'mainNestedList',
			xtype : 'nestedlist',
			useTitleAsBackText : false,
			docked : 'left',
			width : 250,
			store : 'Demos'
		}, {
			id : 'mainNavigationBar',
			xtype : 'navigationbar',
			docked : 'top',
			title : '',
			items : [{
	            id: 'launchscreen',
	            cls : 'launchscreen',
	            html: '<div style="text-align:center;"><img src="logo.png"  /></div>'
	        }]
		} ]
	},
	constructor : function() {
		var me = this;
		me.callParent(arguments);

		window.setTimeout(function(){
		Oskari.clazz.create('Oskari.framework.oskari.Touch').start(
				function(bi) {
					var map = bi.getMap();

					
					var mapdemo = Ext.create('Ext.Mapster', {
						//width : 512,
						height : 712,
						mapOptions : {}
					});
					mapdemo.map = map;
					mapdemo.renderMap();

					var mapcontainer = Ext.create('Ext.Panel',{
						layout: 'fit',
						items: [mapdemo]
					});

					me.add(mapcontainer);
					
					map.updateSize();

				});
		},200);

	}

});
