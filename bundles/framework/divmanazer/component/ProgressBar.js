/**
       * @class Oskari.userinterface.component.ProgressBar
       *
       * Simple progressbar
       */
Oskari.clazz.define('Oskari.userinterface.component.ProgressBar',
    function () {
        this._progressBar = jQuery('<div class="oskari-progressbar"></div>');
        this._element = null;
        this._updating = false;
        for (var p in this.__eventHandlers) {
            if (this.__eventHandlers.hasOwnProperty(p)) {
                Oskari.getSandbox().registerForEventByName(this, p);
            }
        }
    }, {
        defaultColor: 'rgba( 0, 40, 190, 0.4 )',
        __name: 'ProgressBar',
        getName: function () {
            return this.__name;
        },
        __eventHandlers: {
            'ProgressEvent': function (event) {
                var me = this;
                var oskariLayer = Oskari.getSandbox().getMap().getSelectedLayer(event._id);

                if (event._status) {
                    if (oskariLayer.getOptions().singleTile) {
                        oskariLayer.loadingDone(0);
                        if (!me.isUpdating()) {
                            me.show();
                        }
                        me.update(1, oskariLayer.loaded);
                    }
                }
            }
        },
        onEvent: function (event) {
            var handler = this.__eventHandlers[event.getName()];
            if (!handler) {
                return;
            }
            return handler.apply(this, [event]);
        },
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
                height: '0.5%',
                background: this.defaultColor,
                width: 0,
                transition: 'width 250ms',
                zIndex: 25000
            });
            var content = target;
            content.append(this._element);
            return this._element;
        },
        update: function (goal, current) {
            if (goal <= 0) {
                return;
            }
            this._updating = true;
            var width = (current / goal * 100).toFixed(1);
            this._element.css({ width: width + '%' });
            if (width >= 100.0) {
                this.hide();
                this._updating = false;
            }
        },
        setColor: function (color) {
            this._element.css({ background: color });
        },
        isUpdating: function () {
            return this._updating;
        },
        show: function () {
            this._element.css({ visibility: 'visible' });
        },
        hide: function () {
            var me = this;
            setTimeout(function () {
                me._element.css({ visibility: 'hidden', width: 0, background: me.defaultColor });
            }, 1000);
        }

    });
