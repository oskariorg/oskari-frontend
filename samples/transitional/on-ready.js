/**
 * ?trains=off&wikipedia=off&solsol=off&pluginFeatureEditor=off&pluginGraticule=off
 */

// jQuery(window).load(function(){
Ext.require(['*']);
Ext.Loader.setConfig({
	enabled : true
});
Ext.Loader.setPath('Ext.ux', '../../libraries/extjs/ext-4.0.7-gpl/examples/ux/');

/*
 * Ext.require([ 'Ext.data.Store', 'Ext.data.proxy.Ajax', 'Ext.ux.BoxReorderer',
 * 'Ext.ux.DataView.Animated' ]);
 */
Ext.onReady(function() {

	var args = null;
	if(location.search.length > 1) {
		args = Ext.urlDecode(location.search.substring(1));
	} else {
		args = {};
	}

	if(args.oskariLoaderMode)
		Oskari.setLoaderMode(args.oskariLoaderMode);
	else
		Oskari.setLoaderMode('yui');
	if(args.oskariLoaderAsync && args.oskariLoaderAsync == 'on') {
		Oskari.setSupportBundleAsync(true);
	}

	Oskari.clazz.create('Oskari.mapframework.transitional.Starter').start();

});
