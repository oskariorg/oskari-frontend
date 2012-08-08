Ext.define(
        'Oskari.mapframework.bundle.myplaces.model.MyPlacesCategory', 
{
    extend : 'Ext.data.Model',
    fields : [ 
               'id', 
               'name',
               'isDefault',
               'lineWidth',
               'lineColor',
               'fillColor',
               'dotSize',
               'dotColor'
             ]
}
);