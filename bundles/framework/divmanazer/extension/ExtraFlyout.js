/**
 * @class Oskari.userinterface.extension.ExtraFlyout
 *
 * Extra Flyout implementation which shall be used as a super class
 * to actual implementations.
 *
 */
Oskari.clazz.define('Oskari.userinterface.extension.ExtraFlyout',
    /**
     * @method create called automatically on construction
     * @static
     *
     * Always extend this class, never use as is.
     */
    function (title, options) {
        // UI text for title
        this.title = title;
        this._visible = true;
        this._popup = null;
        /* @property container the DIV element */
        this.container = null;
        this.options = options || {};
        this._baseZIndex = 20000;
        this._init();
        Oskari.makeObservable(this);
    }, {
        __templates: {
            popup: jQuery('<div class="oskari-flyout">' +
                '   <div class="oskari-flyouttoolbar">' +
                '       <div class="oskari-flyoutheading"></div>' +
                '       <div class="oskari-flyout-title"><p></p></div>' +
                '       <div class="oskari-flyouttools">' +
                '           <div class="oskari-flyouttool-close">' +
                '               <div class="icon-close icon-close:hover"> </div>' +
                '           </div>' +
                '       </div>' +
                '   </div>' +
                '   <div class="oskari-flyoutcontentcontainer">' +
                '       <div class="oskari-flyoutcontent"></div>' +
                '   </div>' +
                '</div>'),
            sideTool: ({ label }) =>
                `<div class="sidetool">
                    <div class="icon icon-arrow-white-right"></div>
                    <label class="verticalsidelabel">${Oskari.util.sanitize(label)}</label>
                </div>`,
            toolage: jQuery('<div class="oskari-flyouttool-help"></div>' +
                '<div class="oskari-flyouttool-attach"></div>' +
                '<div class="oskari-flyouttool-detach"></div>' +
                '<div class="oskari-flyouttool-minimize"></div>' +
                '<div class="oskari-flyouttool-restore"></div>')
        },
        _init: function () {
            if (this.options.isExtension === true) {
                this._createExtensionFlyout();
            } else {
                this.__render();
            }
        },
        addToolage: function () {
            var toolage = this.__templates.toolage.clone();
            this._popup.find('.oskari-flyouttools').prepend(toolage);
        },
        isVisible: function () {
            return this._visible;
        },
        isResizable: function () {
            return this.options.resizable === true;
        },
        show: function () {
            var me = this;
            if (me.isVisible()) {
                return;
            }
            me._popup.show();
            me.bringToTop();
            me._visible = true;
            this.trigger('show');
        },
        hide: function (suppressEvent) {
            var me = this;
            if (!me.isVisible()) {
                return;
            }
            me._popup.hide();
            me._visible = false;
            suppressEvent = suppressEvent || false;
            if (!suppressEvent) {
                this.trigger('hide');
            }
        },
        __render: function () {
            var me = this;
            var popup = me._popup || me.__templates.popup.clone();

            if (!me._popup) {
                if (!me.options.container) {
                    jQuery(Oskari.dom.getRootEl()).append(popup);
                } else {
                    me.options.container.append(popup);
                }

                popup.find('.oskari-flyouttool-close').on('click', function () {
                    me.hide();
                });

                me._popup = popup;
                me.bringToTop();
                me._popup.on('mousedown', function () {
                    me.bringToTop();
                });
                me.hide(true);
            }

            if (me.options.visible === true) {
                me.show();
            }

            me.setTitle(me.title);
            me.addClass(me.options.cls);
            me.setSize(me.options.width, me.options.height);
        },
        _createExtensionFlyout: function () {
            var me = this;
            this._popup = this.__templates.popup.clone();

            this._popup.on('mousedown', function () {
                me.bringToTop();
            });
            this.setTitle(this.title);
            this.addClass('oskari-closed');
            if (this.options.cls) {
                this.addClass(this.options.cls);
            }
            this.addToolage();
            this.makeDraggable();
            this.move(this.options.left, this.options.top);
        },
        setTitle: function (title) {
            var me = this;
            if (!this._popup) {
                return;
            }
            me._popup.find('.oskari-flyout-title p').html(title || '');
        },
        getTitle: function () {
            var me = this;
            return me._popup.find('.oskari-flyout-title p');
        },
        /**
         * @method  @public setContent Set content
         * @param {Object} content jQuery object
         */
        setContent: function (content) {
            var me = this;
            me._popup.find('.oskari-flyoutcontent').html(content);
        },
        addClass: function (cls) {
            if (!this._popup) {
                return;
            }
            this._popup.addClass(cls);
        },
        addClassForContent: function (cls) {
            if (this._popup) {
                this._popup.find('.oskari-flyoutcontent').addClass(cls);
            }
        },
        setSize: function (width, height) {
            if (!this._popup) {
                return;
            }
            if (width) {
                this._popup.css('width', width);
            }
            if (height) {
                this._popup.css('height', height);
            }
        },
        bringToTop: function () {
            if (!this._popup) {
                return;
            }
            this._popup.css('z-index', this._baseZIndex + Oskari.seq.nextVal());
        },
        move: function (left, top, keepOnScreen) {
            if (!this._popup) {
                return;
            }
            if (keepOnScreen) {
                var size = this.getSize();
                if (left + size.width > jQuery(window).width()) {
                    left = jQuery(window).width() - size.width;
                }
                if (left < 0) {
                    left = 0;
                }
                if (top + size.height > jQuery(window).height()) {
                    top = jQuery(window).height() - size.height;
                }
                if (top < 0) {
                    top = 0;
                }
            }
            this._popup.css({
                'left': left,
                'top': top
            });
        },
        showOnPosition: function () {
            const { position } = this.getOptions();
            if (position) {
                this.move(position.x, position.y, true);
            }
            this.show();
        },
        getPosition: function () {
            if (!this._popup) {
                return;
            }
            return this._popup.position();
        },
        getSize: function () {
            if (!this._popup) {
                return;
            }
            return {
                width: this._popup.width(),
                height: this._popup.height()
            };
        },
        toggle: function () {
            if (this.isVisible()) {
                this.hide();
            } else {
                this.show();
            }
        },
        /**
         * @method makeDraggable
         * Makes dialog draggable with jQuery Event Drag plugin
         * @param options  optional options for draggable
         */
        makeDraggable: function (options) {
            var me = this;
            options = options || {};
            me._popup.css('position', 'absolute');
            me._popup.draggable({
                scroll: !!options.scroll,
                handle: options.handle || '.oskari-flyouttoolbar',
                stop: function () {
                    // prevent to drag flyout's toolbar out of the viewport's top
                    if (me._popup.position().top < 0) {
                        me._popup.css('top', '0px');
                    }
                }
            });
        },
        /**
         * @method makeResizable
         * Makes dialog resizable with jQuery
         * @param opts optional options for resizing
         */
        makeResizable: function (opts = {}) {
            var me = this;
            this.options.resizable = true;
            const defaults = {
                minWidth: 300,
                minHeight: 200,
                handles: 'n,e,s,w,ne,nw,se,sw',
                containment: 'document'
            };
            const resizeOpts = { ...defaults, ...opts };
            const el = this.getElement();
            el.resizable({
                ...resizeOpts,
                stop: function () {
                    me.trigger('resize', { ...me.getSize() });
                }
            });
            // set min size to element, so it can't be smaller than with resize
            el.css('min-width', resizeOpts.minWidth);
            el.css('min-height', resizeOpts.minHeight);
            el.find('.oskari-flyoutcontentcontainer').css('max-height', 'none');
        },
        getElement: function () {
            return this._popup;
        },
        getContent: function () {
            return this._popup.find('.oskari-flyoutcontent');
        },
        getOptions: function () {
            return this.options;
        },

        /************************************************************************************************
* Side tool functions
************************************************************************************************/
        _updateSideLabelPositions: function () {
            var me = this;
            var sidelabels = me._popup.find('.sidetool');
            var flyout = me._popup;
            var heights = flyout.find('.oskari-flyouttoolbar').outerHeight();
            jQuery.each(sidelabels.get(), function (index, sidelabel) {
                if (index === 0) {
                    jQuery(this).css('top', heights);
                    heights += jQuery(this).height() + 10;
                } else {
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
        addSideTool: function (label, callback) {
            var me = this;
            var sidelabel = jQuery(this.__templates.sideTool({ label: label }));

            var textWidth = function (el) {
                // Only create the dummy element once
                var calc = jQuery('<span>').css('font', el.css('font')).css({ 'font-size': el.css('font-size'), display: 'none', 'white-space': 'nowrap' }).appendTo('body');
                var width = calc.html(el.html()).width();
                // Empty out the content until next time - not needed, but cleaner
                calc.remove();
                return width;
            };

            var textSize = textWidth(sidelabel.find('label'));

            var flyout = me._popup;

            sidelabel.css('margin-left', '-16px');
            flyout.append(sidelabel);

            sidelabel.css('height', (textSize + sidelabel.find('.icon').height() + 10) + 'px');

            if (typeof callback === 'function') {
                sidelabel.on('click', function () {
                    var position = me._popup.position();
                    var bounds = {
                        left: position.left + sidelabel.position().left - 16,
                        top: position.top + sidelabel.position().top
                    };
                    bounds.right = bounds.left + sidelabel.outerWidth();
                    bounds.bottom = bounds.top + sidelabel.height();
                    callback(sidelabel, bounds);
                });
            }

            me._updateSideLabelPositions();

            if (!me._addedResizeListener) {
                me._popup.on('DOMSubtreeModified', function () {
                    clearTimeout(me._sidetoolTimer);
                    me._sidetoolTimer = setTimeout(function () {
                        me._updateSideLabelPositions();
                    }, 10);
                });
                me._addedResizeListener = true;
            }
        },
        /**
         * @method  @public removeSideTools Remove sidetools
         */
        removeSideTools: function () {
            var me = this;
            var sidelabels = me._popup.find('.sidetool');
            sidelabels.each(function (index, sidelabel) {
                jQuery(sidelabel).remove();
            });
        }
    });
