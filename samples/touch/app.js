Ext.Loader.setConfig( {
	enabled : true

});

Ext.require( [ 'Ext.Map', 'Ext.Button', 'Ext.SegmentedButton', 'Ext.Panel',
       		'Ext.Toolbar',
       		'Oskari.controller.Main',
       		'Oskari.model.Demo',
       		'Oskari.view.Main'
       		]);


Ext.application( {
	name : 'Oskari',
	controllers : [ 'Main' ]
});
