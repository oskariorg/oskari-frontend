/**
 * @class Oskari.mapframework.bundle.metadatacatalogue.MetadataCatalogueBundleInstance
 *
 * Main component and starting point for the "metadata catalogue" functionality.
 * Provides metadata catalogue search functionality for the map.
 *
 * See Oskari.mapframework.bundle.metadatacatalogue.MetadataCatalogueBundle for bundle definition.
 *
 */
Oskari.clazz
    .define("Oskari.catalogue.bundle.metadatacatalogue.MetadataCatalogueBundleInstance",

        /**
         * @method create called automatically on construction
         * @static
         */

        function () {
            this.sandbox = null;
            this.started = false;
            this.plugins = {};
            this.localization = null;
            this.service = null;
            this.tabPriority = 5.0;
        }, {
            /**
             * @static
             * @property __name
             */
            __name: 'catalogue.bundle.metadatacatalogue',
            /**
             * @static
             * @property templates
             */
            templates: {
                metadataTab: jQuery('<div class="metadataCatalogueContainer">' +
                    '<div class="metadataCatalogueDescription"></div>' +
                    '<div class="controls"></div>'+
                    '<div class="moreLess"></div>'+
                    '<div class="advanced"></div>'+
                    '</div>'),
                moreLessLink: jQuery('<a href="JavaScript:void(0);" class="moreLessLink"></a>'),
                advanced: jQuery('<div class="advanced"></div>'),
                metadataCheckbox: jQuery('<div class="metadataType"><label class="metadataTypeText"><input type="checkbox" class="metadataMultiDef"></label></div>'),
                metadataDropdown: jQuery('<div class="metadataType"><select class="metadataDef"></select></div>'),
                dropdownOption: jQuery('<option></option>'),
                checkboxRow: jQuery('<div class="metadataRow checkboxRow"><div class="rowLabel"></div class=""><div class="checkboxes"></div></div></div>'),
                dropdownRow: jQuery('<div class="metadataRow dropdownRow"><div class="rowLabel"></div></div>')
            },
            /**
             * @method getName
             * @return {String} the name for the component
             */
            "getName": function () {
                return this.__name;
            },
            /**
             * @method setSandbox
             * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
             * Sets the sandbox reference to this component
             */
            setSandbox: function (sandbox) {
                this.sandbox = sandbox;
            },
            /**
             * @method getSandbox
             * @return {Oskari.mapframework.sandbox.Sandbox}
             */
            getSandbox: function () {
                return this.sandbox;
            },
            /**
             * @method getLocalization
             * Returns JSON presentation of bundles localization data for
             * current language.
             * If key-parameter is not given, returns the whole localization
             * data.
             *
             * @param {String} key (optional) if given, returns the value for
             *         key
             * @return {String/Object} returns single localization string or
             *      JSON object for complete data depending on localization
             *      structure and if parameter key is given
             */
            getLocalization: function (key) {
                if (!this._localization) {
                    this._localization = Oskari.getLocalization(this.getName());
                }
                if (key && this._localization[key]) {
                    return this._localization[key];
                }
                if (!this.localization) {
                    return {};
                }
                return this._localization;
            },
            /**
             * @method start
             * implements BundleInstance protocol start method
             */
            "start": function () {
                var me = this;

                if (me.started) {
                    return;
                }

                me.started = true;

                var conf = this.conf;
                var sandboxName = (conf ? conf.sandbox : null) || 'sandbox';
                var sandbox = Oskari.getSandbox(sandboxName);

                me.sandbox = sandbox;

                this.localization = Oskari.getLocalization(this.getName());

                var ajaxUrl = null;
                if (this.conf && this.conf.url) {
                    ajaxUrl = this.conf.url;
                } else {
                    ajaxUrl = sandbox.getAjaxUrl() + 'action_route=GetMetadataSearchOptions';
                }

                // Default tab priority
                if (this.conf && typeof this.conf.priority === 'number') {
                    this.tabPriority = this.conf.priority;
                }

                var servName =
                    'Oskari.catalogue.bundle.metadatacatalogue.service.MetadataCatalogueService';
                this.service = Oskari.clazz.create(servName, ajaxUrl);

                sandbox.register(me);
                var p;
                for (p in me.eventHandlers) {
                    if (me.eventHandlers.hasOwnProperty(p)) {
                        sandbox.registerForEventByName(me, p);
                    }
                }

                // draw ui
                me.createUi();

            },
            /**
             * @method init
             * implements Module protocol init method - does nothing atm
             */
            "init": function () {
                return null;
            },
            /**
             * @method update
             * implements BundleInstance protocol update method - does
             * nothing atm
             */
            "update": function () {

            },
            /**
             * @method onEvent
             * @param {Oskari.mapframework.event.Event} event a Oskari event
             * object
             * Event is handled forwarded to correct #eventHandlers if found
             * or discarded if not.
             */
            onEvent: function (event) {

                var handler = this.eventHandlers[event.getName()];
                if (!handler) {
                    return;
                }

                return handler.apply(this, [event]);

            },
            /**
             * @property {Object} eventHandlers
             * @static
             */
            eventHandlers: {},

            /**
             * @method stop
             * implements BundleInstance protocol stop method
             */
            "stop": function () {
                var sandbox = this.sandbox(),
                    p;
                for (p in this.eventHandlers) {
                    if (this.eventHandlers.hasOwnProperty(p)) {
                        sandbox.unregisterFromEventByName(this, p);
                    }
                }

                var reqName = 'userinterface.RemoveExtensionRequest';
                var reqBuilder = sandbox.getRequestBuilder(reqName);
                var request = reqBuilder(this);

                sandbox.request(this, request);

                this.sandbox.unregisterStateful(this.mediator.bundleId);
                this.sandbox.unregister(this);
                this.started = false;
            },
            /**
             * @method getTitle
             * @return {String} localized text for the title of the component
             */
            getTitle: function () {
                return this.getLocalization('title');
            },
            /**
             * @method getDescription
             * @return {String} localized text for the description of the
             * component
             */
            getDescription: function () {
                return this.getLocalization('desc');
            },
            /**
             * @method createUi
             * (re)creates the UI for "metadata catalogue" functionality
             */
            createUi: function () {
                var me = this;

                var metadataCatalogueContainer = this.templates.metadataTab.clone();

                var metadataCatalogueDescription = metadataCatalogueContainer.find('div.metadataCatalogueDescription');
                metadataCatalogueDescription.html(me.getLocalization('metadataCatalogueDescription'));

                var field = Oskari.clazz.create('Oskari.userinterface.component.FormInput');

                var regex = /[\s\w\d\.\,\?\!\-äöåÄÖÅ]*\*?$/;
                field.setContentCheck(true, me.getLocalization('contentErrorMsg'), regex);

                field.bindChange(function (event) {
                    if (me.state === null) {
                        me.state = {};
                    }
                    var value = field.getValue();
                    me.state.metadatacataloguetext = value;
                    if (!value) {
                        // remove results when field is emptied
                        var info = metadataCatalogueContainer.find('div.info');
                        info.empty();
                        var resultList = metadataCatalogueContainer.find('div.resultList');
                        resultList.empty();

                        // try to remove markers if request is available when field is emptied
                        var reqBuilder = sandbox.getRequestBuilder('MapModulePlugin.RemoveMarkerRequest');
                        if (reqBuilder) {
                            sandbox.request(me.instance.getName(), reqBuilder());
                        }
                    }
                });
                field.addClearButton();

                var button = Oskari.clazz.create('Oskari.userinterface.component.Button');
                button.setTitle(me.getLocalization('metadataCatalogueButton'));

                var doMetadataCatalogue = function () {
                    alert("Searching Metadata");
                };

                button.setHandler(doMetadataCatalogue);
                field.bindEnterKey(doMetadataCatalogue);

                var controls = metadataCatalogueContainer.find('div.controls');
                controls.append(field.getField());
                controls.append(button.getButton());

                // Metadata catalogue tab
                var title = me.getLocalization('title');
                var content = metadataCatalogueContainer;
                var priority = this.tabPriority;
                var reqName = 'Search.AddTabRequest';
                var reqBuilder = me.sandbox.getRequestBuilder(reqName);
                var req = reqBuilder(title, content, priority);
                me.sandbox.request(me, req);

                // Link to advanced search
                var moreLessLink = this.templates.moreLessLink.clone();
                moreLessLink.html(me.getLocalization('showMore'));
                moreLessLink.click(function() {
                    me.service.doSearch(null, function (data) {
                        var advancedContainer = metadataCatalogueContainer.find('div.advanced');
                        if (moreLessLink.html() === me.getLocalization('showMore')) {
                            moreLessLink.html(me.getLocalization('showLess'));
                            if (advancedContainer.is(':empty')) {
                                var dataFields = data.fields;
                                for (var i=0; i < dataFields.length; i++) {
                                    var dataField = dataFields[i];
                                    var newRow = null;
                                    var newLabel = me.getLocalization(dataField.field);
                                    // Checkbox
                                    if (dataField.multi) {
                                        newRow = me.templates.checkboxRow.clone();
                                        newRow.find('div.rowLabel').text(newLabel);
                                        for (var j=0; j < dataField.values.length; j++) {
                                            var value = dataField.values[j];
                                            var text = "";
                                            // Localization available?
                                            if (typeof value.locale !== "undefined") {
                                                text = value.locale;
                                            } else {
                                                text = value.val;
                                            }
                                            var newCheckbox = me.templates.metadataCheckbox.clone();
                                            newCheckbox.find(":checkbox").attr("name",text);
                                            newCheckbox.find(":checkbox").attr("value",text);
                                            newCheckbox.find("label.metadataTypeText").append(text);
                                            newRow.find(".checkboxes").append(newCheckbox);
                                        }
                                    // Dropdown list
                                    } else {
                                        newRow = me.templates.dropdownRow.clone();
                                        newRow.find("div.rowLabel").append(newLabel);
                                        var newDropdown = me.templates.metadataDropdown.clone();
                                        for (var j=0; j < dataField.values.length; j++) {
                                            var value = dataField.values[j];
                                            var text = "";
                                            // Localization available?
                                            if (typeof value.locale !== "undefined") {
                                                text = value.locale;
                                            } else {
                                                text = value.val;
                                            }
                                            var newOption = me.templates.dropdownOption.clone();
                                            newOption.attr("value",text);
                                            newOption.text(text);
                                            newDropdown.find(".metadataDef").append(newOption);
                                        }
                                        newRow.append(newDropdown);
                                    }
                                    advancedContainer.append(newRow);
                                }
                            } else {
                                advancedContainer.show();
                            }
                        } else {
                            moreLessLink.html(me.getLocalization('showMore'));
                            advancedContainer.hide();
                        }
                    }, function (data) {
                        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                        var okBtn = dialog.createCloseButton('OK');
                        var title = me.getLocalization('metadatacatalogueservice_alert_title');
                        var msg = me.getLocalization('metadatacatalogueservice_not_found_anything_text');
                        dialog.show(title, msg, [okBtn]);
                    });
                });
                metadataCatalogueContainer.find('div.moreLess').append(moreLessLink);


            },
            /**
             * @method setState
             * @param {Object} state bundle state as JSON
             */
            setState: function (state) {

            },
            /**
             * @method getState
             * @return {Object} bundle state as JSON
             */
            getState: function () {

            }
        }, {
            /**
             * @property {String[]} protocol
             * @static
             */
            "protocol": [
                'Oskari.bundle.BundleInstance',
                'Oskari.mapframework.module.Module'
            ]
        }
        );