

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
        me.progressSpinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');
        me._templates = {
            table: jQuery('<table class="layer-rights-table"><thead></thead><tbody></tbody></table>'),
            cellTh: jQuery('<th></th>'),
            cellTd: jQuery('<td></td>'),
            row: jQuery('<tr></tr>'),
            checkBox: jQuery('<input type="checkbox" />'),
            name: jQuery('<span class="layer-name"></span>')
        };
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
                    '       <div class="admin-layerrights-layers">' +
                    '       </div>' +
                    '       <div class="controls"></div>' +
                    '   </form>' +
                    '</div>\n'
            );
            var rightsLoc = this.instance._localization.rights,
                elParent;
            this.columns = [
                {id: "name", "name": rightsLoc.name},
                {id: "isSelected", "name": rightsLoc.rightToPublish},
                {id: "isViewSelected", "name": rightsLoc.rightToView},
                {id: "isDownloadSelected", "name": rightsLoc.rightToDownload},
                {id: "isViewPublishedSelected", "name": rightsLoc.rightToPublishView}
            ];

            elParent = this.container.parentElement.parentElement;
            jQuery(elParent).addClass('admin-layerrights-flyout');
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
        /**
        * @method doSave
        * Save layer rights
        */
        doSave : function () {
            "use strict";
            var me = this,
                selections = me.extractSelections(),
                saveData = {"resource" : JSON.stringify(selections)},
                rightsLoc = this.instance._localization.rights,
                dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');

            me.progressSpinner.start();
            jQuery.ajax({
                type: 'POST',
                url: ajaxUrl + 'action_route=SaveLayerPermission',
                lang: Oskari.getLang(),
                timestamp: new Date().getTime(),
                data: saveData,
                success: function () {
                    me.updatePermissionsTable(me.activeRole, "ROLE");
                    me.progressSpinner.stop();
                    dialog.show(rightsLoc.success.title, rightsLoc.success.message);
                    dialog.fadeout(3000);
                },
                error: function() {
                    me.progressSpinner.stop();
                    dialog.show(rightsLoc.error.title, rightsLoc.error.message);
                    dialog.fadeout(3000);
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

            controls.append(button.getElement());

            roleSelectLabel.html(this.instance.getLocalization('selectRole'));
            container.append(content);

            roleSelect.change(function (event) {
                me.activeRole = jQuery(event.currentTarget).val();
                me.updatePermissionsTable(me.activeRole, "ROLE");
            });

            flyout.append(container);
            // We're only supporting ROLE ATM, USER support might be added later
            me.getExternalIdsAjaxRequest("ROLE", 0);

            /* progress */
            this.progressSpinner.insertTo(container);
        },

        handleRoleChange: function (role, operation) {
            var me = this,
                select = jQuery(this.container).find('select.admin-layerrights-role'),
                option = select.find('option[value=' + role.id +']');

            if (operation == 'remove') {
                option.remove();
            }
            if (operation == 'update') {
                option.html(role.name);
            }
            if (operation == 'add') {
                select.append("<option value=" + role.id +">" + role.name + "</option>");
            }
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
            var me = this,
                table = me._templates.table.clone(),
                thead = table.find('thead'),
                tbody = table.find('tbody'),
                service = this.instance.getSandbox().getService('Oskari.mapframework.service.MapLayerService'),
                headerRow = me._templates.row.clone();

            // Create headers
            jQuery.each(columnHeaders, function(index, header) {
                var thCell = me._templates.cellTh.clone();
                thCell.html(header.name);
                headerRow.append(thCell);
            });
            thead.append(headerRow);

            // Create rows
            jQuery.each(layerRightsJSON, function(index, layerRight) {
                var layer = service.findMapLayer(layerRight.id),
                    dataRow = me._templates.row.clone();
                // lets loop through header
                jQuery.each(columnHeaders, function(index, header) {
                    var value = layerRight[header.id],
                        tooltip = header.name,
                        dataCell = me._templates.cellTd.clone(),
                        cell = null;

                    if (header.id === 'name') {
                        if(layer) {
                            tooltip = layer.getLayerType() + '/' + layer.getInspireName() + '/' + layer.getOrganizationName();
                        }
                        cell = me._templates.name.clone();
                        cell.attr('data-resource', layerRight.resourceName);
                        cell.attr('data-namespace', layerRight.namespace);
                        cell.html(value);
                    } else {
                        cell = me._templates.checkBox.clone();
                        cell.attr('data-right', header.id);
                        if(value){
                            cell.attr('checked', 'checked');
                        }
                    }
                    cell.attr('title', tooltip);
                    dataCell.append(cell);
                    dataRow.append(dataCell);
                });
                tbody.append(dataRow);
            });

            return table;
        },

        /**
         * @method extractSelections
         * Returns dirty table rows as JSON
         * @return {Object} Dirty table rows
         */
        extractSelections : function () {
            "use strict";
            var me = this,
                data = [],
                container = jQuery(me.container),
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
                        dirty = true;
                    }
                    dataObj[right] = value;
                }

                if (cleanDataObj.resourceName !== dataObj.resourceName) {
                    // Don't save stuff in the wrong place...
                    dirty = false;
                }

                if (cleanDataObj.namespace !== dataObj.namespace) {
                    // Don't save stuff in the wrong place...
                    dirty = false;
                }

                if (dirty) {
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
            me.progressSpinner.start();

            jQuery.getJSON(ajaxUrl, {
                action_route: "GetPermissionsLayerHandlers",
                lang: Oskari.getLang(),
                timestamp: new Date().getTime(),
                externalId: activeRole,
               //resourceType: "WMS_LAYER",
                externalType: externalType
            }, function (result) {
                me.progressSpinner.stop();
                // store unaltered data so we can do a dirty check on save
                me.cleanData = result.resource;
                var table = me.createLayerRightGrid(me.columns, result.resource);
                jQuery(me.container).find('.admin-layerrights-layers').empty().append(table);
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
                d,
                rightsLoc = this.instance._localization.rights;

            externalIdSelect.html("");
            if (externalType !== "0") {
                if (selectedId !== "0") {
                    a = '<option value="0" >-- ' + rightsLoc.selectValue + ' --</option>';
                } else {
                    a = '<option value="0" selected="selected">-- ' + rightsLoc.selectValue + ' --</option>';
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