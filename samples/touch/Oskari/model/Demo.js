Ext.define('Oskari.model.Demo', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'text',        type: 'string'},
        {name: 'source',      type: 'string'},
        {name: 'animation',   type: 'auto'},
        {name: 'preventHide', type: 'boolean'},
        {name: 'view',        type: 'string'}
    ]
});
