Oskari.clazz.define('Oskari.mapframework.domain.MaplayerGroup',
    function(json) {
        var me = this;
        me.groups = [];

        json.groups.forEach(function(subgroup) {
            me.groups.push(Oskari.clazz.create('Oskari.mapframework.domain.MaplayerGroup', subgroup));
        });

        me.id  = json.id;
        me.layers = json.layers || [];
        me.name = json.name;
        me.orderNumber = (typeof json.orderNumber !== 'undefined') ? json.orderNumber : 10000;
        me.parentId = (typeof json.parentId !== 'undefined') ? json.parentId : -1;
        me.selectable = (typeof json.selectable === 'boolean') ? json.selectable : true;
        me.toolsVisible = (typeof json.toolsVisible === 'boolean') ? json.toolsVisible : true;
    }, {
        getGroups: function(){
            return this.groups;
        },
        setGroups: function(groups){
            this.groups = groups;
        },
        getId: function(){
            return this.id;
        },
        setId: function(id){
            this.id = id;
        },
        getLayers: function(){
            return this.layers;
        },
        setLayers: function(layers){
            this.layers = layers;
        },
        getName: function(){
            return this.name;
        },
        setName: function(name){
            this.name = name;
        },
        getOrderNumber: function(){
            return this.orderNumber;
        },
        setOrderNumber: function(orderNumber){
            this.orderNumber = orderNumber;
        },
        getParentId: function(){
            return this.parentId;
        },
        setParentId: function(parentId){
            this.parentId = parentId;
        },
        hasSelectable: function(){
            return this.selectable;
        },
        setSelectable: function(selectable){
            this.selectable = selectable;
        },
        hasLayers: function(){
            return this.layers.length > 0;
        },
        hasSubgroups: function(){
            return this.groups.length > 0;
        },
        hasToolsVisible: function(){
            return this.toolsVisible;
        },
        setToolsVisible: function(toolsVisible){
            this.toolsVisible = toolsVisible;
        }
    }
);