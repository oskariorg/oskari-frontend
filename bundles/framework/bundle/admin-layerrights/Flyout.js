/**
 * @class Oskari.framework.bundle.admin-layerrights.Flyout
 *
 * Renders the layer rights management flyout.
 */
Oskari.clazz.define('Oskari.framework.bundle.admin-layerrights.Flyout',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.framework.bundle.admin-layerrights.AdminLayerRightsBundleInstance}
     *        instance reference to component that created the tile
     */
    function (instance) {
        "use strict";
        var me = this;
        me.instance = instance;
        me.container = null;
        me.state = null;
        me.template = null;
    }, {
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName : function () {
            "use strict";
            return 'Oskari.framework.bundle.admin-layerrights.Flyout';
        },

        /**
         * @method setEl
         * @param {Object} el
         *      reference to the container in browser
         * @param {Number} width
         *      container size(?) - not used
         * @param {Number} height
         *      container size(?) - not used
         *
         * Interface method implementation
         */
        setEl : function (el, width, height) {
            "use strict";
            this.container = el[0];
            if (!jQuery(this.container).hasClass('admin-layerrights')) {
                jQuery(this.container).addClass('admin-layerrights');
            }
        },

        /**
         * @method startPlugin
         *
         * Interface method implementation, assigns the HTML templates
         * that will be used to create the UI
         */
        startPlugin : function () {
            "use strict";
            this.template = jQuery(
                '<div class="admin-layerrights">\n' +
                    '   <form method="post" id="admin-layerrights-form">' +
                    '       <label><span></span>' +
                    '          <select class="admin-layerrights-role"></select>\n' +
                    '       </label>' + /*
                    '       <label for="admin-layerrights-theme">Theme</label>' +
                    '       <select id="admin-layerrights-theme"></select>\n' +
                    '       <label for="admin-layerrights-dataprovidere">Data provider</label>' +
                    '       <select id="admin-layerrights-dataprovider"></select>\n' +*/
                    '       <table class="admin-layerrights-layers">' +
                    '       </table>' +
                    '       <div class="controls"></div>' +
                    '   </form>' +
                    '</div>\n'
            );
        },

        /**
         * @method stopPlugin
         *
         * Interface method implementation, does nothing atm
         */
        stopPlugin : function () {
            "use strict";
        },

        /**
         * @method getTitle
         * @return {String} localized text for the title of the flyout
         */
        getTitle : function () {
            "use strict";
            return this.instance.getLocalization('title');
        },

        /**
         * @method getDescription
         * @return {String} localized text for the description of the
         * flyout
         */
        getDescription : function () {
            "use strict";
            return this.instance.getLocalization('desc');
        },

        /**
         * @method getOptions
         * Interface method implementation, does nothing atm
         */
        getOptions : function () {
            "use strict";
        },

        /**
         * @method setState
         * @param {Object} state
         */
        setState : function (state) {
            "use strict";
            this.state = state;
        },

        /**
         * @method getState
         * @return {Object} state
         */
        getState : function () {
            "use strict";
            if (!this.state) {
                return {};
            }
            return this.state;
        },

        doSave : function () {
            "use strict";
            // save data
            // get stuff from slickgrid, pass it as json to actionroute
            alert("Savety save.");
        },

        /**
         * @method setContent
         * Creates the UI for a fresh start
         */
        setContent : function (content) {
            "use strict";
            // TODO add filters (provider/theme etc.)
            var me = this,
                //sandbox = me.instance.getSandbox(),
                flyout = jQuery(this.container),
                container = this.template.clone(),
                button = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                controls = container.find('div.controls'),
                roleSelectLabel = container.find('label > span'),
                roleSelect = container.find('select.admin-layerrights-role');

            flyout.empty();
            button.setTitle(me.instance.getLocalization('save'));

            button.setHandler(me.doSave);
            // Not sure if we want save on enter
            //field.bindEnterKey(doSave);

            controls.append(button.getButton());

            roleSelectLabel.html(this.instance.getLocalization('selectRole'));
            container.append(content);
            
            roleSelect.change(function () {
                me.updatePermissionsTable(roleSelect.find("option:selected").val(), "ROLE");
            });
            flyout.append(container);
            // We're only supporting ROLE ATM, USER support might be added later
            me.getExternalIdsAjaxRequest("ROLE", 0);

        },

        updatePermissionsTable : function (activeRole, externalType) {
            "use strict";
            alert("Update permissions table with role: " + activeRole);
            jQuery.getJSON(ajaxUrl, {
                cmd: "ajax.jsp",
                lang: Oskari.getLang(),
                timestamp: new Date().getTime(),
                externalId: activeRole,
                resourceType: "WMS_LAYER", // default karttataso, hardcoded for now (TODO move to backend)
                externalType: externalType
            }, function (result) {
                console.log(result);
            });
        },

        getExternalIdsAjaxRequest : function (externalType, selectedId) {
            "use strict";
            var me = this;

            //ajaxRequestGoing = true;
            // TODO add error handling
            jQuery.getJSON(ajaxUrl, {
                action_route: "GetAllRoles",
                getExternalIds: externalType
            }, function (result) {
                me.makeExternalIdsSelect(result, externalType, selectedId);
            });
        },

        // result, (c)0/user/role (STRING!), (b)selected id
        /**
         * @param (Object) result
         * @param {String} externalType
         * @param {String} selectedId
         */
        makeExternalIdsSelect : function (result, externalType, selectedId) {
            "use strict";
            var externalIdSelect = jQuery(this.container).find("select.admin-layerrights-role"),
                a,
                d;
            externalIdSelect.html("");
            if (externalType !== "0") {
                if (selectedId !== "0") {
                    a = '<option value="0" >-- Valitse tunniste --</option>';
                } else {
                    a = '<option value="0" selected="selected">-- Valitse tunniste --</option>';
                }
                for (d = 0; d < result.external.length; d += 1) {
                    if (result.external[d].id === selectedId) {
                        a += '<option selected="selected" value="' + result.external[d].id + '">' + result.external[d].name + "</option>";
                    } else {
                        a += '<option value="' + result.external[d].id + '">' + result.external[d].name + "</option>";
                    }
                }
                externalIdSelect.html(a);
            } else {
                externalIdSelect.html("");
            }
        }

    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol' : ['Oskari.userinterface.Flyout']
    });
