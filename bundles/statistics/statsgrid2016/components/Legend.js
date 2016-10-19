Oskari.clazz.define('Oskari.statistics.statsgrid.Legend', function(instance, sandbox) {
    this.instance = instance;
    this.sb = sandbox;
    this.service = sandbox.getService('Oskari.statistics.statsgrid.StatisticsService');
    this.spinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');
    this.__bindToEvents();
}, {
	__visible: false,
	__popup: null,
    __templates : {
    	// style="width:200px;height:300px;background-color:#ff0000;position:absolute;z-index:100000;"
    	popup: jQuery('<div class="statsgrid-legend oskari-flyout" style="width:200px;height:300px;">' +
    		'<div class="oskari-flyouttoolbar">' +
    		'	<div class="oskari-flyoutheading"></div>' +
    		'	<div class="oskari-flyout-title"><p></p></div>' +
    		'	<div class="oskari-flyouttools">' +
    		'		<div class="oskari-flyouttool-close icon-close icon-close:hover"></div>' +
    		'	</div>' +
    		'</div>' +
    		'<div class="oskari-flyoutcontentcontainer"></div>' +
    		'</div>')
    },
    __log: Oskari.log('Oskari.statistics.statsgrid.Legend'),
    __setTitle: function(title) {
    	var me = this;
    	me.__popup.find('.oskari-flyout-title p').html(title);
    },
    render : function(el, title) {
    	var me = this;
        var popup = me.__popup || me.__templates.popup.clone();

        if(!me.__popup) {
        	jQuery('body').append(popup);
        	popup.find('.icon-close').bind('click', function(){
        		me.__visible = false;
        		popup.hide();
        	});
        	me.__popup = popup;
        	me.__updateLocation(el, popup);
    		me.__popup.show();
    		me.__visible = true;
    	} else if(me.__visible === false) {
    		me.__updateLocation(el, popup);
    		me.__popup.show();
    		me.__visible = true;
    	} else if(me.__visible === true) {
    		me.__popup.hide();
    		me.__visible = false;
    	}

    	if(title) {
    		me.__setTitle(title);
    	}

    	me.__update();
    },
    __updateLocation: function(el, popup){
    	var position = el.position();
        var parent = el.parents('.oskari-flyout');
        var left = parent.position().left + parent.outerWidth();
        if(left + popup.width() > jQuery(window).width()) {
            left = left - popup.width() - el.width();
        }
        popup.css({
            left: left,
            top:  parent.position().top + position.top
        });

        popup.css('z-index', 20000);
    },
    __update: function(indicator) {
    	var me = this;
    	if(me.__visible === true) {

    	}
    },
    __bindToEvents : function() {
        var me = this;

        this.service.on('StatsGrid.ActiveIndicatorChangedEvent', function(event) {
            var current = event.getCurrent();
            me.__log.info('Active indicator changed! ', current);
            if(current) {
                me.__update();
            }
        });
    }
});