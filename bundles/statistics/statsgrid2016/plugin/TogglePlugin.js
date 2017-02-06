Oskari.clazz.define('Oskari.statistics.statsgrid.TogglePlugin', function(sandbox, locale) {
    this.sb = sandbox;
    this.locale = locale;
    this.element = null;
}, {
    create : function(tableShown) {
        if(this.element) {
            return this.element;
        }
        var me = this;
        var toggleButtons = jQuery('<div class="statsgrid-published-toggle-buttons"><div class="map"></div><div class="table"></div>');
        var map = toggleButtons.find('.map');
        var table = toggleButtons.find('.table');

        map.attr('title', me.locale.showMap);
        table.attr('title', me.locale.showTable);

        map.bind('click', function() {
            if(!map.hasClass('active')) {
                table.removeClass('active');
                map.addClass('active');
                me.sb.postRequestByName('userinterface.UpdateExtensionRequest',[null, 'close', 'StatsGrid']);
            }
        });

        table.bind('click', function(){
            if(!table.hasClass('active')) {
                map.removeClass('active');
                table.addClass('active');
                me.sb.postRequestByName('userinterface.UpdateExtensionRequest',[null, 'detach', 'StatsGrid']);
            }
        });
        if(tableShown) {
            table.trigger('click');
        } else {
            map.trigger('click');
        }
        this.element = toggleButtons;
        return this.element;
    },
    remove : function() {
        if(!this.element) {
            return;
        }
        this.sb.postRequestByName('userinterface.UpdateExtensionRequest',[null, 'close', 'StatsGrid']);
        this.element.remove();
        this.element = null;
    }
});