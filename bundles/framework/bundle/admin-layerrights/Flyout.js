
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
        me.columns = null;
        me.cleanData = null;
        me.activeRole = null;
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
            var rightsLoc = this.instance._localization.rights;
            this.columns = [
                {id: "name", "name": rightsLoc.name},
                {id: "isSelected", "name": rightsLoc.rightToPublish},
                {id: "isViewSelected", "name": rightsLoc.rightToView},
                {id: "isDownloadSelected", "name": rightsLoc.rightToDownload},
                {id: "isViewPublishedSelected", "name": rightsLoc.rightToPublishView}
            ];
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
            var me = this,
                saveData = {"resource" : me.extractSelections(jQuery(me.container)) };

            jQuery.ajax({
                type: 'POST',
                url: ajaxUrl + 'action_route=SaveLayerPermission',
                lang: Oskari.getLang(),
                timestamp: new Date().getTime(),
                beforeSend : function (x) {
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType("application/j-son;charset=UTF-8");
                    }
                },
                data: saveData,
                success: function () {
                    // TODO use promises
                    me.updatePermissionsTable(me.activeRole, "ROLE");
                },
                error: function() {
                    // TODO add error handling
                }
            });
        },

        /**
         * @method setContent
         * Creates the UI for a fresh start
         * @param {String} content
         */
        setContent : function (content) {
            "use strict";
            // TODO add filters (provider/theme etc.)
            var me = this,
                flyout = jQuery(this.container),
                container = this.template.clone(),
                button = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                controls = container.find('div.controls'),
                roleSelectLabel = container.find('label > span'),
                roleSelect = container.find('select.admin-layerrights-role');

            flyout.empty();
            button.setTitle(me.instance.getLocalization('save'));

            button.setHandler(
                function () {
                    me.doSave();
                }
            );
            // Not sure if we want save on enter
            //field.bindEnterKey(doSave);

            controls.append(button.getButton());

            roleSelectLabel.html(this.instance.getLocalization('selectRole'));
            container.append(content);

            roleSelect.change(function () {
                me.activeRole = roleSelect.find("option:selected").val();
                me.updatePermissionsTable(this.activeRole, "ROLE");
            });

            flyout.append(container);
            // We're only supporting ROLE ATM, USER support might be added later
            me.getExternalIdsAjaxRequest("ROLE", 0);
        },

        /**
         * @method createLayerRightGrid
         * Creates the permissions table as a String
         * @param {Array} columnHeaders
         * @param {Object} layerRightsJSON
         * @return {String} Permissions table
         */
        createLayerRightGrid: function (columnHeaders, layerRightsJSON) {
            "use strict";
            var table = '<table class="layer-rights-table">',
                i = 0,
                tr = 0,
                layerRight = null,
                header = null,
                value = null;

            table += "<thead><tr>";
            for (i  = 0; i < columnHeaders.length; i += 1) {
                table += '<th>' + columnHeaders[i].name + '</th>';
            }
            table += "</tr></thead>";

            table += "<tbody>";
            for (i = 0; tr < layerRightsJSON.length; tr += 1) {
                layerRight = layerRightsJSON[tr];

                table += "<tr>";

                // lets loop through header
                for (i = 0; i < columnHeaders.length; i += 1) {
                    header = columnHeaders[i];
                    //select input value based on arrangement of header columns
                    value = layerRight[header.id];

                    if (header.id === 'name') {
                        table += '<td><span class="layer-name" data-resource="' + layerRight.resourceName + '" data-namespace="' + layerRight.namespace + '">' + value + '</span></td>';
                    } else if (value) {
                        table += '<td><input type="checkbox" checked="checked" data-right="' + header.id + '" /></td>';
                    } else {
                        table += '<td><input type="checkbox" data-right="' + header.id + '" /></td>';
                    }
                }

                table += "</tr>";
            }
            table += "</tbody>";
            return table;
        },

        /**
         * @method extractSelections
         * Returns dirty table rows as JSON
         * @param {Object} container
         * @return {Object} Dirty table rows
         */
        extractSelections : function (container) {
            "use strict";
            var me = this,
                data = [],
                trs = container.find('tbody tr'),
                i = 0,
                j = 0,
                dataObj = null,
                cleanDataObj = null,
                tr = null,
                tdName = null,
                tds = null,
                td = null,
                right = null,
                value = null,
                dirty = false;
            for (i = 0; i < trs.length; i += 1) {
                // TODO check if data has changed on this row before adding to output
                dirty = false;
                cleanDataObj = me.cleanData[i];
                dataObj = {};
                tr = jQuery(trs[i]);
                tdName = tr.find('td span');
                tds = tr.find('td input');
                dataObj.name            = tdName.text();
                dataObj.resourceName    = tdName.attr('data-resource');
                dataObj.namespace       = tdName.attr('data-namespace');
                dataObj.roleId = me.activeRole;

                for (j = 0; j < tds.length; j += 1) {
                    td = jQuery(tds[j]);
                    right = td.attr('data-right');
                    value = td.prop('checked');

                    if (cleanDataObj[right] !== value) {
                        //console.log("Dirty value on " + right + ": " + cleanDataObj[right] + " : " + value);
                        dirty = true;
                    }
                    dataObj[right] = value;
                }

                if (cleanDataObj.resourceName !== dataObj.resourceName) {
                    // Don't save stuff in the wrong place...
                    dirty = false;
                    //console.err("Resource name mismatch: " + cleanDataObj.resourceName + ", " + dataObj.resourceName);
                }

                if (cleanDataObj.namespace !== dataObj.namespace) {
                    // Don't save stuff in the wrong place...
                    dirty = false;
                    //console.err("Namespace mismatch: " + cleanDataObj.namespace + ", " + dataObj.namespace);
                }

                if (dirty) {
                    //console.log(dataObj);
                    data.push(dataObj);
                }
            }
            return data;
        },

        /**
         * @method updatePermissionsTable
         * Refreshes the permissions table with the given role and type
         * @param {String} activeRole
         * @param {String} externalType
         */
        updatePermissionsTable : function (activeRole, externalType) {
            "use strict";
            var me = this;
            jQuery.getJSON(ajaxUrl, {
                action_route: "GetPermissionsLayerHandlers",
                lang: Oskari.getLang(),
                timestamp: new Date().getTime(),
                externalId: activeRole,
               //resourceType: "WMS_LAYER",
                externalType: externalType
            }, function (result) {
                // store unaltered data so we can do a dirty check on save
                me.cleanData = result.resource;
                var table = me.createLayerRightGrid(me.columns, result.resource);
                jQuery(me.container).find('.admin-layerrights-layers').append(table);
            });
        },

        /**
         * @method getExternalIdsAjaxRequest
         * Retrieves permissions data for the given type and role
         * @param {String} externalType
         * @param {String} selectedId
         */
        getExternalIdsAjaxRequest : function (externalType, selectedId) {
            "use strict";
            var me = this;

            //ajaxRequestGoing = true;
            // TODO add error handling
            jQuery.getJSON(ajaxUrl, {
                action_route: "GetAllRoles",
                lang: Oskari.getLang(),
                timestamp: new Date().getTime(),
                getExternalIds: externalType
            }, function (result) {
                me.makeExternalIdsSelect(result, externalType, selectedId);
            });
        },

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