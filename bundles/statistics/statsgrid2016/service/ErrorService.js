/**
 * @class Oskari.statistics.statsgrid.ErrorService
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.ErrorService',

    /**
     * @method create called automatically on construction
     * @static
     */
    function (sandbox) {
        this.sandbox = sandbox;
        this.popup = Oskari.clazz.create('Oskari.userinterface.component.Popup');
    }, {
        __name: "StatsGrid.ErrorService",
        __qname: "Oskari.statistics.statsgrid.ErrorService",

        getQName: function () {
            return this.__qname;
        },
        getName: function () {
            return this.__name;
        },
        show: function(title, message){
            var me = this;
            me.close();
            me.popup.show(title, message);
            me.popup.fadeout(5000);
        },
        close: function(){
            var me = this;
            me.popup.close(true);
        }

    }, {
        'protocol': ['Oskari.mapframework.service.Service']
    });
