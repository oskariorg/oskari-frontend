/*
 * @class Oskari.userinterface.component.ProgressBar
 *
 * Simple progressbar
 */
Oskari.clazz.define('Oskari.userinterface.component.ProgressBar',
    function () {
        this._progressBar = jQuery('<div class="oskari-progressbar"></div>');
        this._element = null;
    }, {
        defaultColor: 'rgba( 0, 40, 190, 0.4 )',
        /** @method create
    *  creates a progressbar with data specified
    * @param {Object} progress, how much into our goal
    * @param {Object} goal, total number which to fill
    * @return {jQuery Element} a list with chosen applied
     */
        create: function (target) {
            this._element = this._progressBar.clone();
            this._element.css({
                position: 'absolute',
                top: 0,
                left: 0,
                height: '7px',
                opacity: 0.75,
                background: this.defaultColor,
                width: 0,
                transition: 'width 250ms',
                zIndex: 25000
            });
            var content = target;
            content.append(this._element);
            return this._element;
        },
        updateProgressBar: function (goal, current, containsErrors = false) {
            if (goal === 0) {
                return;
            }
            // 20% + actual progress to make progress more visible to user
            // top out at 100% so we don't push past the container and cause scrollbars
            var width = Math.min(20 + (current / goal * 80), 100);
            this._element.css({ width: width.toFixed(1) + '%' });
            if (width >= 100.0) {
                this.hide(containsErrors ? 2500 : 400);
            }
            return width;
        },
        setColor: function (color) {
            this._element.css({ background: color });
        },
        show: function () {
            this._element.css({ visibility: 'visible', width: '20%' });
        },
        hide: function (delay = 400) {
            var me = this;
            setTimeout(function () {
                me._element.css({ visibility: 'hidden', width: 0, background: me.defaultColor });
            }, delay);
        }

    });
