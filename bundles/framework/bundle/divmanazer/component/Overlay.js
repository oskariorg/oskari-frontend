/**
 * @class Oskari.userinterface.component.Popup
 * Provides a popup window to replace alert
 */
Oskari.clazz.define('Oskari.userinterface.component.Overlay',

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
        this.template = jQuery('<div class="oskarioverlay transparent"></div>');
        this._overlays = null;
        this._resizingWorkaround = null;
    }, {
        /**
         * @method overlay
         * Overlays an element
         * @param {String} elementSelector, selector for element to overlay
         */
        overlay: function (elementSelector) {
            var me = this,
                targetSelector = elementSelector,
                targets;
            if (!targetSelector) {
                targetSelector = 'body';
            }
            targets = jQuery(targetSelector);
            me._overlays = _.map(targets, function (target) {
                return {
                  overlay: me.template.clone(),
                  target: jQuery(target)
                };
            });
            _.forEach(me._overlays, function (overlay) {
                overlay.target.append(overlay.overlay);
            });
            me._setupSizeAndLocation();
            _.forEach(me._overlays, function (overlay) {
                overlay.overlay.bind('click', function (event) {
                    event.preventDefault();
                })
            });
        },
        _setupSizeAndLocation: function () {
            var me = this;
            _.forEach(me._overlays, function (overlay) {
                overlay.overlay.css({
                    'left': "0px",
                    'top': "0px",
                    'width': overlay.target.width() + 'px',
                    'height': overlay.target.height() + 'px'
                });
            });
        },
        resize: function () {
            var me = this;
            _.forEach(me._overlays, function (overlay) {
                overlay.overlay.height(overlay.target.height());
                overlay.overlay.width(overlay.target.width());
            });
        },
        followResizing: function (useWindow) {
            var me = this;
            if (useWindow) {
                jQuery(window).resize(function () {
                    me.resize();
                });
            } else {
                this._resizingWorkaround = setTimeout(function () {
                    me.resize();
                    me.followResizing();
                }, 500);
            }
        },
        close: function () {
            var me = this;
            _.forEach(me._overlays, function (overlay) {
               overlay.overlay.remove();
            });
            if (this._resizingWorkaround) {
                clearTimeout(this._resizingWorkaround);
            }
        },
        bindClickToClose: function () {
            var me = this;
            _.forEach(me._overlays, function (overlay) {
                overlay.overlay.bind('click', function() {
                    me.close();
                });
            });
        }
    });
