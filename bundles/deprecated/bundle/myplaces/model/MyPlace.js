Ext.define(
        'Oskari.mapframework.bundle.myplaces.model.MyPlace', 
{
    extend : 'Ext.data.Model',
    fields : [ 
               'id', 
               'name', 
               'description',
               'categoryID',
               'geometry',
               'createDate',
               'updateDate'
             ]
}
);