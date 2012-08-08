(function() {
   
    if (Ext.os.deviceType == 'Desktop' || Ext.os.name == 'iOS') {
      
    }

    var root = {
        items: [{
            text  : 'Layers',
            view  : 'Layers',
            leaf  : true
        },{
            text  : 'About',
            view  : 'About',
            leaf  : true
        }]
    };


    Ext.define('Oskari.store.Demos', {
        extend  : 'Ext.data.TreeStore',
        model   : 'Oskari.model.Demo',
        requires: ['Oskari.model.Demo'],

        root: root,
        defaultRootProperty: 'items'
    });
})();
