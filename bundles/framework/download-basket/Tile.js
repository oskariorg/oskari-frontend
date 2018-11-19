/*
 * @class Oskari.mapframework.bundle.downloadBasket.Tile
 *
 * Renders the "Download basket" tile.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.downloadBasket.Tile',

/**
 * @method create called automatically on construction
 * @static
 * @param
 * {Oskari.mapframework.bundle.downloadBasket}
 * instance
 *      reference to component that created the tile
 */
    function (instance) {
        this.instance = instance;
        this.container = null;
        this.template = null;
        this.shownLayerCount = null;
    }, {
    /**
     * Gets name
     * @method getName
     * @public
     * @return {String} the name for the component
     */
        getName: function () {
            return 'Oskari.mapframework.bundle.downloadBasket.Tile';
        },
        /**
     * Interface method implementation
     * @method setEl
     * @public
     * @param {Object} el reference to the container in browser
     */
        setEl: function (el) {
            this.container = jQuery(el);
        },
        /**
     * Interface method implementation, calls #refresh()
     * @method startPlugin
     * @public
     */
        startPlugin: function () {
            this.createUI();
        },
        /**
     * Interface method implementation, clears the container
     * @method stopPlugin
     * @public
     */
        stopPlugin: function () {
            this.container.empty();
        },
        /**
     * Creates the UI for a fresh start
     * @method _createUI
     * @public
     */
        createUI: function () {
            this.container.addClass('download-basket-tile');
            this.container.find('.oskari-tile-status').addClass('icon-bubble-right').html(0);
        },
        /**
     * Gets tile
     * @method getTitle
     * @public
     * @return {String} localized text for the title of the tile
     */
        getTitle: function () {
            return this.instance.getLocalization('title');
        },
        /**
     * Gets description
     * @method getDescription
     * @public
     * @return {String} localized text for the description of the tile
     */
        getDescription: function () {
            return this.instance.getLocalization('desc');
        },
        /**
     * Interface method implementation, does nothing atm
     * @method getOptions
     * @public
     */
        getOptions: function () {
        },
        /**
     * Interface method implementation, does nothing atm
     * @method setState
     * @public
     * @param {Object} state state that this component should use
     */
        setState: function (state) {
        },
        /**
     * Creates the UI for a fresh start
     * @method refresh
     * @public
     */
        refresh: function () {
            var me = this;
            var basketItems = me.instance.basket._selected.length;
            jQuery('.download-basket-tile .oskari-tile-status').html(basketItems);
            me.notifyUser();
        },
        /**
     * Clears tile
     * @method clear
     */
        clear: function () {
            var me = this;
            me.refresh();
        },
        /**
     * Notify user
     * @method notifyUser
     */
        notifyUser: function () {
            var status = this.container.children('.oskari-tile-status');

            // stop current animation
            status.stop();
            // blink 2 times
            this._blink(status, 2);
        },
        /**
     * Blinks icon
     * @method  _blink
     * @param   {Object} element jQuery element
     * @param   {Integer} count   blink coun
     * @private
     */
        _blink: function (element, count) {
            var me = this;
            if (!element) {
                return;
            }
            if (!count) {
                count = 1;
            }
            // animate to low opacity
            element.animate({
                opacity: 0.25
            }, 500, function () {
            // on complete, animate back to fully visible
                element.animate({
                    opacity: 1
                }, 500, function () {
                // on complete, check and adjust the count parameter
                // recurse if count has not been reached yet
                    if (count > 1) {
                        me._blink(element, --count);
                    }
                });
            });
        }
    }, {
    /**
     * @property {String[]} protocol
     * @static
     */
        'protocol': ['Oskari.userinterface.Tile']
    });
