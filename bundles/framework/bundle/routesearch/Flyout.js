/**
 * @class Oskari.mapframework.bundle.routesearch.Flyout
 *
 * Renders the "route search" flyout.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.routesearch.Flyout',
    function () {
        this.state = {};
        this._templates = {};
        this._templates.main =
            '<div>' +
            '</div>' +
            '<div style="display:none;">' + // Hidden at start (no results yet)
            '    <strong></strong>' +
            '    <ul></ul>' +
            '</div>' +
            '<div></div>';
        this.mapEl = this.instance.sandbox.findRegisteredModuleInstance(
            'MainMapModule').getMapEl();
    },
    {
        getName: function () {
            return 'Oskari.mapframework.bundle.routesearch.Flyout';
        },

        _getSearchSuggestions: function (field, event) {
            var me = this,
                target = jQuery(event.target),
                searchKey = target.val(),
                i,
                location,
                suggestionEl = me.getEl().find('#' + field + 'Suggestions');

            if (me.state[field] && me.state[field].name === searchKey) {
                return;
            }

            suggestionEl.empty();

            me.state[field] = {
                "name": searchKey
            };
            if (searchKey && searchKey.length > 2) {
                me.service.doSearch(
                    searchKey,
                    function (data) {
                        // onSuccess
                        console.log("onSuccess", data);
                        if (data && data.totalCount) {
                            // Result(s), show them to the user somehow
                            for (i = 0; i < data.totalCount; i++) {
                                location = data.locations[i];
                                suggestionEl.append("<li>" + location.name + ", " + location.village + "</li>");
                            }
                        } else {
                            // No result
                        }
                    },
                    function (data) {
                        // onError
                        console.log("onError", data);
                    }
                );
            }
        },

        _reverseGeoCode: function (field, lonLat) {
            console.log(field, lonLat);
        },

        disableMapClick: function () {
            delete this.state.field;
            this.mapEl.removeClass("cursor-crosshair");
            this.instance.unregisterMapClickHandler();
        },

        onMapClick: function (lonLat) {
            var me = this;
            if (me.state.field) {
                me._reverseGeoCode(me.state.field, lonLat);
                me.disableMapClick();
            }
        },

        _fromMapButtonHandler: function (field, event) {
            var me = this;
            if (me.state.field === field) {
                // Deselect target on second click
                me.disableMapClick();
            } else {
                me.state.field = field;
                me.instance.registerMapClickHandler();
                me.mapEl.addClass("cursor-crosshair");
            }
        },

        _searchButtonHandler: function (event) {

        },

        /**
         * @method startPlugin
         * called by host to start flyout operations
         */
        startPlugin: function () {
            var me = this,
                ajaxUrl = null,
                el = me.getEl().addClass('routesearch'),
                contents = jQuery(me._templates.main),
                timers = {},
                i,
                field,
                fields = ['from', 'to'],
                tmp;/*
                cancelBtn =
                    Oskari.clazz.create(
                        'Oskari.userinterface.component.buttons.CancelButton'),
                searchBtn =
                    Oskari.clazz.create(
                        'Oskari.userinterface.component.Button');*/

            if (me.instance.conf && me.instance.conf.url) {
                ajaxUrl = me.instance.conf.url;
            } else {
                ajaxUrl =
                    me.getSandbox().getAjaxUrl() +
                        'action_route=GetSearchResult';
            }
            // FIXME temp
            ajaxUrl = "http://localhost:8080/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=2&action_route=GetSearchResult"
            me.service = Oskari.clazz.create(
                'Oskari.mapframework.bundle.search.service.SearchService',
                ajaxUrl
            );

            contents.eq(1).find('strong').html(me.locale.routingService);

            for (i = 0; i < fields.length; i++) {
                field = fields[i];
                tmp = Oskari.clazz.create(
                        'Oskari.userinterface.component.FormInput', field);
                tmp.addClearButton();
                tmp.setLabel(me.locale[field]);
                timers[field] = 0;
                tmp.bindChange(function (event) {
                    event.stopPropagation(); // JUST BECAUSE TEST ENV FAILS
                    var evt = event;
                    if (timers[field]) {
                        clearTimeout(timers[field]);
                    }
                    timers[field] = setTimeout(function () {
                        me._getSearchSuggestions(field, event);
                        timers[field] = null;
                    }, 300);

                }, true);

                contents.eq(0).append(tmp.getField());
                tmp = Oskari.clazz.create(
                        'Oskari.userinterface.component.Button');
                tmp.setTitle(me.locale.fromMap);
                tmp.setHandler(function (event) {
                    me._fromMapButtonHandler(field, event);
                });
                tmp.insertTo(contents.eq(0).find('.oskarifield:eq(' + i + ')'));

                // Suggestions list
                contents.eq(2).append(
                    '<ol id="' + field + 'Suggestions' + '"></ol>');
            }
            /* I'll prolly remove the buttons
            cancelBtn.setHandler(function (event) {
                me.instance.sandbox.postRequestByName(
                    'userinterface.UpdateExtensionRequest',
                    [me.instance, 'close']
                );
            });
            searchBtn.setTitle(me.locale.fetchRoute);
            searchBtn.setHandler(me._searchButtonHandler);
            searchBtn.setPrimary(true);
            searchBtn.insertTo(contents.eq(2));
            cancelBtn.insertTo(contents.eq(2));*/

            el.append(contents);
        },

        _updateRoutingLinks: function () {
            // All the data needed should be in this.state
        }
    },
    {
        'extend': ['Oskari.userinterface.extension.DefaultFlyout']
    }
);