Ext.define('MapPanel', {
    extend: 'Ext.Panel',   
    alias: 'widget.nlsfimappanel',    
//    requires: ['Ext.window.MessageBox'],
    
    initComponent : function(config){
        
        Ext.applyIf(this,config);
        
        this.callParent();        
    },
    
    afterRender : function(){
        
        var wh = this.ownerCt.getSize(); //, point
            
        Ext.applyIf(this, wh);
        
        this.callParent();     
        
        var maptarget = this.body.dom ;
        
        //console.log("--------------------------------------------- MAP RENDERER begin ---------------------");
        this.getMap().render(maptarget);
        //console.log("--------------------------------------------- MAP RENDERER done---------------------");
        
    },
    afterComponentLayout : function(w, h){

        if (typeof this.getMap() == 'object') {
        	this.getMap().updateSize();            
        }
        
        this.callParent(arguments);

    },
    setSize : function(width, height, animate){
        
        if (typeof this.getMap() == 'object') {
        	this.getMap().updateSize();
        }
        
        this.callParent(arguments);
        
    },
    getMap : function(){
        return this.olmap;
        
    },
    getCenter : function(){
        return this.getMap().getCenter();
        
    },
    getCenterLatLng : function(){
        var ll = this.getCenter();
        return {lat: ll.lat(), lng: ll.lng()};
        
    }
 
});