/**
 * @class Oskari.userinterface.extension.DefaultFlyout
 *
 * Default Flyout implementation which shall be used as a super class
 * to actual implementations.
 *
 */
Oskari.clazz.define('Oskari.userinterface.extension.DefaultFlyout',

    /**
     * @method create called automatically on construction
     * @static
     *
     * Always extend this class, never use as is.
     */
    function (instance, locale) {

        /* @property extension instance */
        this.instance = instance;

        /* @property locale locale for this */
        this.locale = locale;

        /* @property container the DIV element */
        this.container = null;

        this._sidetool = null;


    }, {
        __temp:{
            sideTool:_.template(
                '<div class="sidetool">'  +
                '<div class="icon icon-arrow-white-right"></div>' +
                '<label class="verticalsidelabel"></label>'  +
                '</div>')
        },
        //this function collects the label and calls the default flyout function addSideTool sending the label and the callback function.
        getSideLabel : function( text ) {
            var sidelabel = jQuery(this.__temp.sideTool());
            sidelabel.find('label').text(text);
            return sidelabel;
        },
        _calcSideLabelPositions: function(){
            var me = this;
            var sidelabels = me.container.parents('.oskari-flyout').find('.sidetool');
            var flyout = this.container.parents('.oskari-flyout');
            var heights = flyout.find('.oskari-flyouttoolbar').outerHeight();
            jQuery.each(sidelabels.get(), function(index, sidelabel) {
                if(index === 0) {
                    jQuery(this).css('top', heights);
                    heights += jQuery(this).height() + 10;
                }
                else {
                    jQuery(this).css('top', heights + 'px');
                    heights += jQuery(this).height() + 10;
                }
            });
        },
        /**
         * @method  @public addSideTool Add side tool for flyout
         * @param {String}   label    sidetool label
         * @param {Function} callback sidetool callback
         */
        addSideTool: function(label, callback){
            var me = this;
            var sidelabel = this.getSideLabel(label);

            var textWidth = function (el)
            {
                // Only create the dummy element once
                var calc = jQuery('<span>').css('font', el.css('font')).css({'font-size': el.css('font-size'), display: 'none', 'white-space': 'nowrap' }).appendTo('body');
                var width = calc.html(el.html()).width();
                // Empty out the content until next time - not needed, but cleaner
                calc.remove();
                return width;
            };

            var textSize = textWidth(sidelabel.find('label'));

            var flyout = this.container.parents('.oskari-flyout');
            var parent = this.container.parent();
            var width = parent.width();
            if(!me._changedSizeOfContent){
                parent.width(width - 20);
                me._changedSizeOfContent = true;
            } else {
                width += 20;
            }
            sidelabel.css('left', (width - 16) + 'px');
            flyout.append(sidelabel);

            sidelabel.css('height', (textSize + sidelabel.find('.icon').height() + 10) + 'px');

            if(typeof callback === 'function') {
                sidelabel.on('click', function() {
                    var position = me.getEl().parents('.oskari-flyout').position();
                    var bounds = {
                        left : position.left + sidelabel.position().left,
                        top : position.top + sidelabel.position().top
                    };
                    bounds.right = bounds.left + sidelabel.outerWidth();
                    bounds.bottom = bounds.top + sidelabel.height();
                    callback(sidelabel, bounds);
                });
            }

            me._calcSideLabelPositions();

            if(!me._addedResizeListener){
                me.container.parents('.oskari-flyout').bind('DOMSubtreeModified', function(){
                    clearTimeout(me._sidetoolTimer);
                    me._sidetoolTimer = setTimeout(function(){
                        me._calcSideLabelPositions();
                    }, 10);
                });
                me._addedResizeListener = true;
            }
        },
        /**
         * @method  @public removeSideTools Remove sidetools
         */
        removeSideTools: function(){
            var me = this;
            var sidelabels = me.container.parents('.oskari-flyout').find('.sidetool');
            sidelabels.each(function(index, sidelabel) {
                jQuery(sidelabel).remove();
            });
        },

        /**
         * @method getName
         * @return {String} implementation name
         */
        getName: function () {
            return 'Oskari.userinterface.extension.DefaultFlyout';
        },

        /**
         * @method setEl
         * called by host to set DOM element for this Flyouts content
         */
        setEl: function (el) {
            this.container = jQuery(el);
        },

        /**
         * @method  getEl
         * @return {jQuery Object} wrapped DOM element for this Flyout's contents
         */
        getEl: function () {
            return this.container;
        },

        /**
         * @method startPlugin
         * called by host to start flyout operations
         */
        startPlugin: function () {
        },

        /**
         * @method stopPlugin
         * called by host to stop flyout operations
         */
        stopPlugin: function () {
        },

        /**
         * @method getTile
         * @return {String} called by host to get a localised flyout title
         */
        getTitle: function () {
            return this.locale.title;
        },
        /**
         * @method getDescriptions
         * @return {String} called by host to get a localised flyout description
         */
        getDescription: function () {
            return this.locale.description;
        },

        /**
         * @method setState
         * @param {JSON} sets state
         */
        setState: function (state) {
            this.state = state;
        },
        /**
         * @method getState
         * @return {JSON} returns state
         */
        getState: function () {
            return this.state;
        },
        move : function(top, left) {
            var flyout =  this.getEl().parent().parent();
            if(typeof top === 'number' || typeof top === 'string'){
                flyout.css('top', top);
            }
            if(typeof left === 'number' || typeof left === 'string'){
                flyout.css('left', left);
            }
        },
        /**
         * @method close
         * Closes the flyout
         */
        close : function() {
            var instance = this.getExtension();
            var sandbox = this.getSandbox();
            sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [instance, 'close']);
        },

        /**
         * @method getLocalization
         * @return JSON localisation subset 'flyout'
         */
        getLocalization: function () {
            return this.locale ? this.locale : (this.instance ? this.instance.getLocalization().flyout : undefined);
        },

        getSandbox: function () {
            return this.instance.getSandbox();
        },

        getExtension: function () {
            return this.instance;
        },

        /* o2 helpers for notifications and requetss */
        slicer: Array.prototype.slice,

        issue: function () {
            var requestName = arguments[0],
                args = this.slicer.apply(arguments, [1]),
                builder = this.getSandbox().getRequestBuilder(requestName),
                request = builder.apply(builder, args);
            return this.getSandbox().request(this.getExtension(), request);
        },

        notify: function () {
            var eventName = arguments[0],
                args = this.slicer.apply(arguments, [1]),
                builder = this.getSandbox().getEventBuilder(eventName),
                evt = builder.apply(builder, args);
            return this.getSandbox().notifyAll(evt);
        },
        /**
         * Hook function for bundle specific op. Called when flyout is opened.
         */
        onOpen : function() {
            this.getSandbox().printDebug('Opened flyout ' + this.getName());
        },

        /**
         * Hook function for bundle specific op. Called when flyout is closed.
         */
        onClose : function() {
            this.getSandbox().printDebug('Closed flyout' + this.getName());
        }

    }, {
        'protocol': ['Oskari.userinterface.Flyout']
    });
