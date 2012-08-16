/* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 12:23:19 GMT+0300 (Suomen kesäaika)) */ 
/**
 * @class Oskari.mapframework.ui.module.mapfull.MapPositionModule
 * Provides a statusbar panel that shows "Help" button/link to help-page and
 * "loading status"/measurement/mouse position messages
 *
 * TODO: refactor html embedding issues
 */
Oskari.clazz.define('Oskari.mapframework.ui.module.mapfull.MapPositionModule', 

/**
 * @method create called automatically on construction
 * @static
 */
function() {

    this._multipleActionsRunningText = null;
    this._tooltip = null;
    this._sandbox = null;
    this._items = null;
}, {
    /** @static @property __name module name */
    __name : "MapPositionModule",
    /**
     * @method getName
     * @return {String} module name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method init
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sb
     * 			reference to application sandbox
     */
    init : function(sandbox) {
        this._sandbox = sandbox;
        var me = this;

        sandbox.printDebug("Initializing map position module...");

        // events
        for(p in this.eventHandlers ) {
            sandbox.registerForEventByName(this, p);
        }

        var callback = function(msg) {
            me.showMeasurement(msg);
        }
        this.showMeasurementHandler = Oskari.clazz.create('Oskari.mapframework.mapposition.request.ShowMapMeasurementRequestHandler', sandbox, callback);

        sandbox.addRequestHandler('ShowMapMeasurementRequest', this.showMeasurementHandler);

        // UI with Ext components
        var helpButton = Ext.create('Ext.button.Button', {
            text : Oskari.$().startup.instructionsText,
            iconCls : 'map-insctrunctions-image',
            handler : function() {
                me.openHelp();
            }
        });

        var mapMousePosition = Ext.create('Ext.form.Label', {
            width : 128
        });

        var mapMeasure = Ext.create('Ext.form.Label', {
            width : 128,
            flex : 1
        });

        var mapStatusText = Ext.create('Ext.form.Label', {
            flex : 3
        });

        var panel = Ext.create('Ext.ux.StatusBar', {
            defaultText : '',
            id : 'right-statusbar',
            statusAlign : 'right',
            items : [helpButton, '-', mapMousePosition, mapMeasure, mapStatusText]
        });

        // store items for further use
        this._items = {
            mapMousePosition : mapMousePosition,
            mapMeasure : mapMeasure,
            mapStatusText : mapStatusText
        };

        this._multipleActionsRunningText = sandbox.getText('status_multiple_tasks_running');
        this._tooltipHeaderText = sandbox.getText('status_tooltip_header');

        return panel;
    },
    /**
     * @method start
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sb
     * 			reference to application sandbox
     */
    start : function(sandbox) {
        sandbox.printDebug("Starting " + this.getName());
    },
    /**
     * @method stop
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sb
     * 			reference to application sandbox
     */
    stop : function(sandbox) {

    },
    /**
     * @method showMeasurement
     * @param {String} message
     * 			message to show
     * Shows the given message in measurement text placeholder
     */
    showMeasurement : function(message) {
        this._items['mapMeasure'].setText(message);
    },
    /**
     * @method openHelp
     * Requests for popupwindow with help text to be shown
     */
    openHelp : function() {

        var url = Oskari.$().startup.instructionsUrl;

        /* Let's use overlay popup for this one */
        var request = this._sandbox.getRequestBuilder('ShowOverlayPopupRequest')(url);
        this._sandbox.request(this.getName(), request);
    },
    /**
     * @method handleAfterMapMoveEvent
	 * Changes the mouse position placeholder value to coordinates in the event
     *
     * @param {Oskari.mapframework.event.common.AfterMapMoveEvent}
     *            event map move event object
     */
    handleAfterMapMoveEvent : function(event) {
        var longitude = event.getCenterX();
        var latitude = event.getCenterY();

        var txt = "N: " + Math.round(parseInt(latitude)) + " E: " + Math.round(parseInt(longitude));
        this._items['mapMousePosition'].setText(txt);
    },
    /**
     * @method handleMouseHoverEvent
	 * Changes the mouse position placeholder value to coordinates in the event
     *
     * @param {Oskari.mapframework.event.common.MouseHoverEvent}
     *            event event object
     */
    handleMouseHoverEvent : function(event) {
        var longitude = event.getLon();
        var latitude = event.getLat();

        var txt = "N: " + Math.round(parseInt(latitude)) + " E: " + Math.round(parseInt(longitude));
        this._items['mapMousePosition'].setText(txt);
    },
    /**
     * @method handleActionStatusesChangedEvent
	 * Changes the "loading status" placeholder value depending on ongoing actions based on the event
     *
     * @param {Oskari.mapframework.event.action.ActionStatusesChangedEvent}
     *            event event object
     */
    handleActionStatusesChangedEvent : function(event) {

        var fullText = "";
        var statuses = event.getCurrentlyRunningActionsDescriptions();

        if(statuses.length == 0) {
            /* Nothing going on */

            this._items['mapStatusText'].setText('');

            var extStatusTooltip = Ext.getCmp("status-tooltip");
            if(extStatusTooltip != null) {
                extStatusTooltip.destroy();
            }

            return;
        }

        /* Something going on */
        for(var i = 0; i < statuses.length; i++) {
            fullText += "<p>" + statuses[i] + "</p>";
        }

        if(this._tooltip != null) {
            this._tooltip.destroy();
        }

        this._tooltip = Ext.create('Ext.tip.ToolTip', {
            id : 'status-tooltip',
            target : 'status-text',
            title : this._tooltipHeaderText,
            width : 300,
            trackMouse : true,
            html : fullText,
            showDelay : 0,
            hideDelay : 0,
            elements : 'body'
        });
        text = statuses[0];
        var count = statuses.length;
        if(count > 1) {
            text = count + " " + this._multipleActionsRunningText;
        }

        this._items['mapStatusText'].setText(text);

    },
    /**
     * @property {Object} eventHandlers
     * @static
     */
    eventHandlers : {
        'ToolSelectedEvent' : function(event) {
            var toolName = event.getToolName();
            this._items['mapMeasure'].setText('');
        },
        'AfterMapMoveEvent' : function(event) {
            this.handleAfterMapMoveEvent(event);
        },
        'ActionStatusesChangedEvent' : function(event) {
            this.handleActionStatusesChangedEvent(event);
        },
        'MouseHoverEvent' : function(event) {
            this.handleMouseHoverEvent(event);
        }
    },

    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded
     * if not.
     */
    onEvent : function(event) {
        var handler = this.eventHandlers[event.getName()];

        if(!handler)
            return;

        return handler.apply(this, [event]);
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.module.Module']
});

/* Inheritance */Oskari.clazz.define('Oskari.mapframework.mapposition.request.ShowMapMeasurementRequestHandler', 
    function(sandbox, callBack) {

    this.sandbox = sandbox;
    this._callBack = callBack;
}, {
    handleRequest : function(core, request) {
    	// ShowMapMeasurementRequest
    	var value = request.getValue(); 
        this.sandbox.printDebug("[ShowMapMeasurementRequestHandler] got measurement: " + value);
        if(this._callBack) {
        	this._callBack(value);
        }
    }
}, {
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
/**
 * @class Oskari.mapframework.bundle.DefaultMapPositionBundleInstance
 */
Oskari.clazz.define("Oskari.mapframework.bundle.DefaultMapPositionBundleInstance", function(b) {
	this.name = 'mapposition';
	this.mediator = null;
	this.sandbox = null;

	this.impl = null;

	this.ui = null;
},
/*
 * prototype
 */
{

	/**
	 * start bundle instance
	 *
	 */
	"start" : function() {

		if(this.mediator.getState() == "started")
			return;

		this.libs = {
			ext : Oskari.$("Ext")
		};

		this.facade = Oskari.$('UI.facade');
		this.impl = Oskari.clazz.create('Oskari.mapframework.ui.module.mapfull.MapPositionModule');

		var def = this.facade.appendExtensionModule(this.impl, this.name, this.eventHandlers, this, 'StatusRegion', {
			'fi' : {
				title : ''
			},
			'sv' : {
				title : ''
			},
			'en' : {
				title : ''
			}

		});
		this.def = def;

		this.impl.start(this.facade.getSandbox());

		this.mediator.setState("started");
		return this;
	},
	/**
	 * notifications from bundle manager
	 */
	"update" : function(manager, b, bi, info) {
		manager.alert("RECEIVED update notification @BUNDLE_INSTANCE: " + info);
	},
	/**
	 * stop bundle instance
	 */
	"stop" : function() {

		this.impl.stop();

		this.facade.removeExtensionModule(this.impl, this.name, this.eventHandlers, this, this.def);
		this.def = null;

		this.impl = null;

		this.mediator.setState("stopped");

		return this;
	},
	getName : function() {
		return this.__name;
	},
	__name : "Oskari.mapframework.bundle.DefaultMapPositionBundleInstance"

}, {
	"protocol" : ["Oskari.bundle.BundleInstance", "Oskari.mapframework.bundle.extension.Extension"]
});
