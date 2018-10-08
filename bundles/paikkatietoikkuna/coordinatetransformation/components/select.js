Oskari.clazz.define('Oskari.coordinatetransformation.component.select',
    function ( instance ) {
        var me = this;
        me.instance = instance;
        me.selectInstances = {};
        me.dropdowns = {};
    }, {
        getSelectInstances: function () {
            return this.selectInstances;
        },
        getDropdowns: function () {
            return this.dropdowns;
        },
        create: function () {
            var json = this.instance.helper.getOptionsJSON();

            var selections = [];
            var dropdowns = {};
            var selects = {};
            var options = {}
            Object.keys( json ).forEach( function ( key ) {
                var instanceKey = key;
                var value = json[key];
                var size = Object.keys( value ).length;
                Object.keys( value ).forEach( function ( key ) {
                    var obj = value[key];
                    var valObject = {
                        id : obj.id,
                        title : obj.title,
                        cls: obj.cls
                    };
                    selections.push( valObject );
                    // First element, set placeholder
                    if ( key === '0' ) {
                        options = {
                            placeholder_text: obj.title,
                            allow_single_deselect : true,
                            disable_search_threshold: 10,
                            width: '100%'
                        };
                    }
                     if ( key == size -1 ) {
                        var select = Oskari.clazz.create('Oskari.userinterface.component.SelectList', 'id');
                        var dropdown = select.create(selections, options);
                        selections = [];
                        options = {};
                        dropdown.css( { width:'180px' } );
                        select.adjustChosen();
                        select.selectFirstValue();
                        selects[instanceKey] = select;
                        dropdowns[instanceKey] = dropdown;  
                     }
                });
            });
            this.dropdowns = dropdowns;
            this.selectInstances = selects;
        }
});
 