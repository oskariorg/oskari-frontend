/**
 * @class Oskari.catalogue.bundle.metadataflyout.view.MetadataPanel
 *
 *
 * This hosts metadata content loaded via ajax from
 * Geonetwork
 *
 * Embeds  metadata information.
 *
 */
Oskari.clazz.define('Oskari.catalogue.bundle.metadataflyout.view.MetadataPanel',

    /**
     * @method create called automatically on construction
     * @static
     *
     * Always extend this class, never use as is.
     */
    function (instance, locale, model) {

        /* @property instance bundle instance */
        this.instance = instance;

        /* @property locale locale for this */
        this.locale = locale;

        /* element references */
        this._tabs = {};
        this._browseGraphicUrl = null;

        /**
         * @property state
         */
        this.state = null;

        /**
         * @private @property _model
         */
        this._model = model;
        // Put locale into model so templates can get codeList values...
        model.locale = locale;

        /**
         * @private @property _tabContainer {Oskari.userinterface.component.TabContainer}
         */
        this._tabContainer = null;

        this._maplayerService = this.instance.sandbox.getService('Oskari.mapframework.service.MapLayerService');

        this.asyncTabs = {};
        /**
         * @static @private @property _templates HTML/underscore templates for the User Interface
         */
        this._templates = {
            // TODO add ifExists type of thing to all of these...
            tabs: {
                'title': _.template(
                    '<article>' +
                    '    <% if (identification.abstractText.length) { %>' +
                    '        <% _.forEach(identification.abstractText, function (paragraph) { %>' +
                    '            <p><%= paragraph %></p>' +
                    '        <% }); %>' +
                    '           <% if (identification.type === "service") {%>'+
                    '               <p><%=identification.serviceType%></p>'+
                    '           <% } %>'+
                    '    <% } %>' +

                    '    <% if (onlineResources.length) { %>' +
                    '        <ul>' +
                    '        <% _.forEach(onlineResources, function (onlineResource) { %>' +
                    '            <% if (onlineResource.url.length) { %>' +
                    '                <li><a href="<%= onlineResource.url %>"><%= onlineResource.name && onlineResource.name.length ? onlineResource.name : onlineResource.url %></a></li>' +
                    '            <% } %>' +
                    '        <% }); %>' +
                    '        </ul>' +
                    '    <% } %>' +
                    '   <hr class="elf-metadata-divider">'+

                    '   <h2>'+this.locale.heading.datasetInformation+'</h2>'+
                    '   <table class="elf-metadata-table-no-border">'+
                    '       <tr>'+
                    '           <td>'+this.locale.tableHeaders.datasetInformation.referenceDate+'</td>'+
                    '           <td>'+
                    '               <p title="<%= (locale.codeLists["gmd:CI_DateTypeCode"][identification.citation.date.dateType] || {description: identification.citation.date.dateType}).description %>"><%- identification.citation.date.date %> (<%=' +
                    '               (locale.codeLists["gmd:CI_DateTypeCode"][identification.citation.date.dateType] || {label: identification.citation.date.dateType}).label' +
                    '               %>)</p>' +
                    '           </td>'+
                    '       </tr>'+
                    '       <tr>'+
                    '           <td>'+this.locale.tableHeaders.datasetInformation.temporalInformation+'</td>'+
                    '           <td>'+
                    '           <% _.forEach(identification.temporalExtents, function (temporalExtent) { %>' +
                    '               <p><%= temporalExtent.begin %> - <%= temporalExtent.end %></p>' +
                    '           <% }); %>' +
                                        //TODO: "updated:" + maintenanceAndUpdateFrequency
                    '           </td>'+
                    '       </tr>'+
                    '       <tr>'+
                    '           <td>'+this.locale.heading.descriptiveKeyword+'</td>'+
                    '           <td>'+
                    '               <ul>' +
                    '               <% _.forEach(identification.descriptiveKeywords, function (keyword) { %>' +
                    '                   <% if (keyword.length) { %>' +
                    '                       <li><%- keyword %></li>' +
                    '                   <% } %>' +
                    '               <% }); %>' +
                    '               </ul>' +
                    '           </td>'+
                    '       </tr>'+
                    '       <tr>'+
                    '           <td>'+this.locale.tableHeaders.datasetInformation.resourceLanguage+'</td>'+
                    '           <td>'+
                    '               <ul>' +
                    '               <% _.forEach(identification.languages, function (language) { %>' +
                    '                   <li><%= locale.languages[language] || language %></li>' +
                    '               <% }); %>' +
                    '               </ul>' +
                    '           </td>'+
                    '       </tr>'+
                    '       <% if (geom) { %>'+
                    '           <tr>'+
                    '               <td>'+this.locale.tableHeaders.datasetInformation.bbox+'</td>'+
                    '               <td>'+
                    '                   <a href="javascript:void(0)" class="metadata_coverage_bbox_link">'+
                                            this.locale.coverage.showBBOX +
                    '                   </a>'+
                    '               </td>'+
                    '           </tr>'+
                    '       <% } %>'+

                    '       <% if (typeof referenceSystems !== "undefined" && referenceSystems.length) {%>'+
                    '       <tr>'+
                    '           <td>'+
                                    this.locale.tableHeaders.datasetInformation.crs+
                    '           </td>'+
                    '           <td>'+
                    '               <ul>' +
                    '               <% _.forEach(referenceSystems, function(referenceSystem) { %>'+
                    '                   <li><%=referenceSystem%></li>' +
                    '               <% }); %>'+
                    '               </ul>' +
                    '           </td>'+
                    '       </tr>'+
                    '       <% } %>'+
                    '   </table>'+
                    '   <hr class="elf-metadata-divider">'+
                    '   <h2>'+this.locale.heading.contactInformation+'</h2>'+
                    '   <table class="elf-metadata-table-no-border">'+
                    '       <tr>'+
                    '           <td>'+this.locale.tableHeaders.contactInformation.pointOfContact+'</td>'+
                    '           <td>'+
                    '               <ul>' +
                    '               <% _.forEach(identification.responsibleParties, function (responsibleParty) { %>' +
                    '                   <li><%- responsibleParty.organisationName %></li>' +
                    '                   <% if (responsibleParty.electronicMailAddresses.length) { %>' +
                    '                       <ul>' +
                    '                       <% _.forEach(responsibleParty.electronicMailAddresses, function (electronicMailAddress) { %>' +
                    '                           <li><%- electronicMailAddress %></li>' +
                    '                       <% }); %>' +
                    '                       </ul>' +
                    '                   <% } %>' +
                    '                   </li>' +
                    '               <% }); %>' +
                    '               </ul>' +
                    '           </td>'+
                    '       </tr>'+
                    '   </table>'+
                    '   <hr class="elf-metadata-divider">'+
                    '   <h2>'+this.locale.heading.metadataContact+'</h2>'+
                    '   <table class="elf-metadata-table-no-border">'+
                    '       <tr>'+
                    '           <td>'+this.locale.tableHeaders.metadataContact.pointOfContact+'</td>'+
                    '           <td>'+
                    '               <ul>' +
                    '                   <% _.forEach(metadataResponsibleParties, function (metadataResponsibleParty) { %>' +
                    '                       <li><%- metadataResponsibleParty.organisationName %>' +
                    '                       <% if (metadataResponsibleParty.electronicMailAddresses.length) { %>' +
                    '                           <ul>' +
                    '                               <% _.forEach(metadataResponsibleParty.electronicMailAddresses, function (electronicMailAddress) { %>' +
                    '                               <li><%- electronicMailAddress %></li>' +
                    '                           <% }); %>' +
                    '                           </ul>' +
                    '                       <% } %>' +
                    '                       </li>' +
                    '                   <% }); %>' +
                    '                </ul>' +
                    '           </td>'+
                    '       </tr>'+
                    '   </table>'+
                    '   <hr class="elf-metadata-divider">'+
                    '   <h2>'+this.locale.heading.technicalInformation+'</h2>'+
                    '   <table class="elf-metadata-table-no-border">'+
                    '       <tr>'+
                    '           <td>'+this.locale.tableHeaders.technicalInformation.accessConstraintInformation+'</td>'+
                    '           <td>'+
                    '               <% _.forEach(identification.useLimitations, function (useLimitation) { %>' +
                    '                   <% _.forEach(useLimitation, function (paragraph) { %>' +
                    '                       <p><%= paragraph %></p>' +
                    '                   <% }); %>' +
                    '               <% }); %>' +
                    '               <% _.forEach(identification.otherConstraints, function (otherConstraint) { %>' +
                    '                   <% _.forEach(otherConstraint, function (paragraph) { %>' +
                    '                       <p><%= paragraph %></p>' +
                    '                   <% }); %>' +
                    '               <% }); %>' +
                    '               <ul>'+
                    '               <% _.forEach(identification.classifications, function (classification) { %>' +
                    '                   <li title="<%= (locale.codeLists["gmd:MD_ClassificationCode"][classification] || {description: classification}).description %>"><%= (locale.codeLists["gmd:MD_ClassificationCode"][classification] || {label: classification}).label %></li>' +
                    '               <% }); %>' +
                    '               </ul>'+
                    '           </td>'+
                    '       </tr>'+
                    '       <tr>'+
                    '           <td>'+this.locale.heading.spatialRepresentationType+'</td>'+
                    '           <td>'+
                    '               <ul>' +
                    '                   <% _.forEach(identification.spatialRepresentationTypes, function (spatialRepresentationType) { %>' +
                    '                       <li title="<%= (locale.codeLists["gmd:MD_SpatialRepresentationTypeCode"][spatialRepresentationType] || {description: spatialRepresentationType}).description %>"><%= (locale.codeLists["gmd:MD_SpatialRepresentationTypeCode"][spatialRepresentationType] || {label: spatialRepresentationType}).label %></li>' +
                    '                   <% }); %>' +
                    '               </ul>' +
                    '           </td>'+
                    '       </tr>'+
                    '       <tr>'+
                    '           <td>'+this.locale.heading.spatialResolution+'</td>'+
                    '           <td>'+
                    '               <ul>' +
                    '                   <% _.forEach(identification.spatialResolutions, function (resolution) { %>' +
                    '                       <li>1: <%- resolution %></li>' +
                    '                   <% }); %>' +
                    '               </ul>' +
                    '           </td>'+
                    '       </tr>'+
                    '       <tr>'+
                    '           <td>'+this.locale.tableHeaders.technicalInformation.lineage+'</td>'+
                    '           <td>'+
                    '               <% _.forEach(lineageStatements, function (lineage) { %>' +
                    '                   <% _.forEach(lineage, function (paragraph) { %>' +
                    '                       <p><%= paragraph %></p>' +
                    '                   <% }); %>' +
                    '               <% }); %>' +
                    '           </td>'+
                    '       </tr>'+
                    '       <tr>'+
                    '           <td>'+this.locale.tableHeaders.technicalInformation.metadataChangeDate+" / "+this.locale.tableHeaders.technicalInformation.uniqueIdentifier+'</td>'+
                    '           <td>'+
                    '               <%- metadataDateStamp %> / <%- fileIdentifier %></p>' +
                    '           </td>'+
                    '       </tr>'+
                    '   </table>'+

                    '   <% if (typeof score !== "undefined" && typeof amount !== "undefined") { %>'+
                    '       <div class="metadatatab-rating-container">'+
                    '       <hr class="elf-metadata-divider">'+
                    '       <h2>'+this.locale.heading.dataQuality+'</h2>'+
                    '       <table class="elf-metadata-table-no-border">'+
                    '           <tr>'+
                    '               <td>'+this.locale.tableHeaders.dataQuality.conformance+'</td>'+
                    '               <td>'+
                    '                   <div class="metadata-feedback-rating ratingInfo"></div>'+
                    '               </td>'+
                    '           </tr>'+
                    '       </table>'+
                    '       </div>'+
                    '   <% } %>'+
                    '</article>'
                ),
                'quality': _.template(
                    '<article>' +
                    '    <% if (lineageStatements.length) { %>' +
                    '        <h2>' + this.locale.heading.lineageStatement + '</h2>' +
                    '        <% _.forEach(lineageStatements, function (lineage) { %>' +
                    '           <% _.forEach(lineage, function (paragraph) { %>' +
                    '               <p>${paragraph}</p>' +
                    '           <% }); %>' +
                    '        <% }); %>' +
                    '    <% } %>' +
                    '    <% if (dataQualities.length) { %>' +
                    '        <% _.forEach(dataQualities, function (dataQuality) { %>' +
                    '           <h2> ${dataQuality.UIlabel}</h2>' +
                    '           <% if (dataQuality.nameOfMeasure) { %>' +
                                    this.locale.qualityContent.nameOfMeasure + ': <%= dataQuality.nameOfMeasure %> <br>' +
                    '           <% } %>' +
                    '           <% if (dataQuality.measureDescription) { %>' +
                                    this.locale.qualityContent.measureDescription + ': <%= dataQuality.measureDescription %> <br>' +
                    '           <% } %>' +
                    '           <% if (dataQuality.evaluationMethodType) { %>' +
                                    this.locale.qualityContent.evaluationMethodType + ': <%= dataQuality.evaluationMethodType %> <br>' +
                    '           <% } %>' +
                    '           <% if (dataQuality.evaluationMethodDescription) { %>' +
                                    this.locale.qualityContent.evaluationMethodDescription + ': <%= dataQuality.evaluationMethodDescription %> <br>' +
                    '           <% } %>' +
                    '           <% if (dataQuality.measureIdentificationAuthorization) { %>' +
                                    this.locale.qualityContent.measureIdentificationAuthorization + ': <%= dataQuality.measureIdentificationAuthorization %> <br>' +
                    '           <% } %>' +
                    '           <% if (dataQuality.measureIdentificationCode) { %>' +
                                   this.locale.qualityContent.measureIdentificationCode + ': <%= dataQuality.measureIdentificationCode %> <br>' +
                    '           <% } %>' +
                    '           <% if (dataQuality.dateTime.length) { %>' +
                    '               <% _.forEach(dataQuality.dateTime, function (dateTime) { %>' +
                    '                   <% if (dateTime) { %>' +
                                            this.locale.qualityContent.dateTime + ': <%= dateTime %> <br>' +
                    '                   <% } %>' +
                    '               <% }); %> '+
                    '           <% } %>' +
                    '           <% if (dataQuality.conformanceResultList.length) { %>' +
                    '               <h3>' + this.locale.qualityContent.conformanceResult + '</h3>' +
                    '               <% _.forEach(dataQuality.conformanceResultList, function (conformanceResult) { %>' +
                    '                   <% if (conformanceResult.specification) { %>' +
                                            this.locale.qualityContent.specification + ': <%= conformanceResult.specification %> <br>' +
                    '                   <% } %>' +
                    '                   <% if (conformanceResult.pass === true) {%> <%=locale.qualityContent.qualityPassTrue%><br><%}' +
                    '                       else { %> <%=locale.qualityContent.qualityPassFalse%> <br> <% } %> '+
                    '                   <% if (conformanceResult.explanation) { %>' +
                                            this.locale.qualityContent.explanation + ': <%= conformanceResult.explanation %> <br>' +
                    '                   <% } %>' +
                    '               <% }); %> '+
                    '           <% } %>' +
                    '           <% if (dataQuality.quantitativeResultList.length) { %>' +
                    '               <h3>' + this.locale.qualityContent.quantitativeResult + '</h3>' +
                    '               <% _.forEach(dataQuality.quantitativeResultList, function (quantitativeResult) { %>' +
                    '                   <% if (quantitativeResult.valueType) { %>' +
                                            this.locale.qualityContent.valueType + ': <%= quantitativeResult.valueType %> <br>' +
                    '                   <% } %>' +
                    '                   <% if (quantitativeResult.valueUnit) { %>' +
                                            this.locale.qualityContent.valueUnit + ': <%= quantitativeResult.valueUnit %> <br>' +
                    '                   <% } %>' +
                    '                   <% if (quantitativeResult.errorStatistic) { %>' +
                                            this.locale.qualityContent.errorStatistic + ': <%= quantitativeResult.errorStatistic %> <br>' +
                    '                   <% } %>' +
                    '                   <% if (dataQuality.quantitativeResult.length) { %>' +
                    '                       <% _.forEach(dataQuality.quantitativeResult, function (value) { %>' +
                    '                           <% if (value) { %>' +
                                                    this.locale.qualityContent.value + ': <%= value %> <br>' +
                    '                           <% } %>' +
                    '                       <% }); %> '+
                    '                   <% } %>' +
                    '               <% }); %> '+
                    '           <% } %>' +
                    '       <% }); %> '+
                    '    <% } %> '+
                    '</article>'
                ),
                'actions': _.template(
                    '<article>'+
                    '</article>'
                )
            },
            'layerList': _.template(
                '<table class="metadataSearchResult">'+
                '   <tr>'+
                '       <td>'+
                '           <div class="layerListHeader"><h2></h2></div>'+
                '           <ul class="layerList">'+
                '           </ul>'+
                '       </td>'+
                '   </tr>'+
                '</table>'
            ),
            'layerItem': _.template(
                '<li>'+
                '   <%=layer.getName()%>&nbsp;&nbsp;'+
                '   <a href="JavaScript:void(0);" class="layerLink">'+
                '       <%=hidden ? locale.layerList.show : locale.layerList.hide%>'+
                '   </a>'+
                '</li>'
            )
        };
    }, {
        /**
         * @static
         * @property __name
         *
         */
        __name: 'Oskari.catalogue.bundle.metadataflyout.view.MetadataPanel',

        getName: function () {
            return this.__name;
        },
        /**
         * @method onEvent
         */
        onEvent: function (event) {
            var handler = this.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }

            return handler.apply(this, [event]);

        },

        /**
         * @property eventHandlers
         * @static
         *
         */
        eventHandlers: {
            AfterMapLayerAddEvent: function (event) {
                /* this might react when layer added */
                this.renderMapLayerList();
            },
            /**
             * @method AfterMapLayerRemoveEvent
             */
            AfterMapLayerRemoveEvent: function (event) {
                this.renderMapLayerList();
            },
            MapLayerVisibilityChangedEvent: function(event) {
                this.renderMapLayerList();
            },
            MapLayerEvent: function(event) {
                /*add + no layerid -> mass load -> all map layers probably loaded*/
                if (event.getOperation() === "add" && event.getLayerId() === null) {
                    this.renderMapLayerList();
                }
            },
            /**
             * @method userinterface.ExtensionUpdatedEvent
             * Catch my flyout
             */
            'userinterface.ExtensionUpdatedEvent': function (event) {
                var me = this;
                if (event.getExtension().getName() !== me.instance.getName()) {
                    // not me -> do nothing
                    return;
                }
                var viewState = event.getViewState();
                if (viewState === 'close') {
                    //parent closing -> clear my eventhandlers
                    for (var p in me.eventHandlers) {
                        if (me.eventHandlers.hasOwnProperty(p)) {
                            me.instance.sandbox.unregisterFromEventByName(me, p);
                        }
                    }
                }
            }
        },

        /**
         * @public @method init
         *
         * @param {boolean} open
         *
         */
        init: function (open) {
            var browseGraphics,
                entry,
                i,
                identification,
                images = [],
                me = this,
                locale = me.locale,
                model = me._model,
                tabContainerHeader,
                tabId;

            /* Tab container */
            me._tabContainer = Oskari.clazz.create(
                'Oskari.userinterface.component.TabContainer'
            );

            me._tabContainer.insertTo(me.getContainer());
            /* let's create view selector tabs */
            var asyncTabsFound = false;
            for (tabId in me._templates.tabs) {
                if (me._templates.tabs.hasOwnProperty(tabId)) {

                    //only show quality tab for services and datasets
                    //TODO: maybe make this a configurable thing at some point instead of hardcoding...
                    if (tabId === 'quality' && (model.identification.type !== 'series' && model.identification.type !== 'data')) {
                        continue;
                    }

                    //license tab but no license url -> skip rendering the tab.
                    if (tabId === 'license' && (!model.license || model.license === "")) {
                        continue;
                    }

                    entry = Oskari.clazz.create(
                        'Oskari.userinterface.component.TabPanel'
                    );
                    entry.setId(tabId);
                    //skip async tabs whose content comes from someplace else
                    if (me._templates.tabs[tabId]) {
                        //the "native" tabs have keys in this bundles locale
                        entry.setTitle(locale[tabId]);
                        entry.setContent(
                            me._templates.tabs[tabId](model)
                        );
                    } else if (me.asyncTabs && me.asyncTabs[tabId] && me.asyncTabs[tabId].tabActivatedCallback) {
                        asyncTabsFound = true;
                        var newTabTitle = me.asyncTabs[tabId].title ? me.asyncTabs[tabId].title : "";
                        entry.setTitle(newTabTitle);
                    }

                    me._tabContainer.addPanel(entry);
                    me._tabs[tabId] = entry;
                }
            }

            /*add the tab change event listener only once.*/
            if (asyncTabsFound) {
                me._tabContainer.addTabChangeListener(function(previousTab, newTab) {
                    if (newTab && newTab.getId() && !newTab.content) {
                        if (me.asyncTabs[newTab.getId()] && me.asyncTabs[newTab.getId()].tabActivatedCallback) {
                            me.asyncTabs[newTab.getId()].tabActivatedCallback(me._model.uuid, newTab, me._model);
                        }
                    }
                });
            }

            browseGraphics =
                me._tabContainer.getElement().find('.browseGraphic');
            browseGraphics.click(function () {
                jQuery(this).toggleClass('fullsize');
            });

            identification = model.identification;

            for (i = 0; i < identification.browseGraphics.length; i += 1) {
                images[i] = new Image();
                images[i].src = identification.browseGraphics[i].fileName;
            }
            me.addActionLinks();
            me.renderMapLayerList();

            me.setTitle(me._model.identification.citation.title);
            if (open) {
                me.open();
            }
        },
        /**
         * @public method addTabs
         * The "synchronous" way of adding tabs by external bundles (=external bundles have already finished loading before rendering this)
         *
         * @param {Object} tabsJSON
         * {
         *   //key is used as the tab's title and must map to a key in localization file
         *   'key' : {
         *     //content as an underscore template, optional
         *     template: {_.template}
         *     //a callback to call when tab gets activated. Will take a reference to the panel and get the content asynchronously
         *     tabActivatedCallback: function(panel)
         *   },
         *   'key2': {
         *     template: {_.template}
         *     tabActivatedCallback: function(panel)
         *   }
         * }
         *
         */
        addTabs: function(tabsJSON) {
            var me = this;
            me.asyncTabs = tabsJSON;
            for (var tabId in tabsJSON) {
                me._templates.tabs[tabId] = tabsJSON[tabId].template ? tabsJSON[tabId].template : null;
            }
        },
        addTabsAsync: function(tabsJSON) {
            var me = this,
                model = me._model;

            for (var tabId in tabsJSON) {
                me.asyncTabs[tabId] = tabsJSON[tabId];
                if (tabsJSON.hasOwnProperty(tabId)) {

                    //only show quality tab for services and datasets
                    //TODO: maybe make this a configurable thing at some point instead of hardcoding...
                    if (tabId === 'quality' && (model.identification.type !== 'series' && model.identification.type !== 'data')) {
                        continue;
                    }

                    //license tab but no license url -> skip rendering the tab.
                    if (tabId === 'license' && (!model.license || model.license === "")) {
                        continue;
                    }

                    //feedback tab added asynchronously -> also get and reveal the ratings under metadata tab...
                    if (tabId === 'feedback' && model.amount) {
                        me.getMetadataTabRatingStars();
                    }

                    var entry = Oskari.clazz.create(
                        'Oskari.userinterface.component.TabPanel'
                    );
                    entry.setId(tabId);

                    if (tabsJSON[tabId].tabActivatedCallback) {
                        var newTabTitle = tabsJSON[tabId].title ? tabsJSON[tabId].title : "";
                        entry.setTitle(newTabTitle);
                    }
                    me._tabContainer.addPanel(entry);
                    me._tabs[tabId] = entry;
                }
            }

            if (!me._tabContainer.tabChangeListeners || me._tabContainer.tabChangeListeners.length === 0) {
                me._tabContainer.addTabChangeListener(function(previousTab, newTab) {
                    if (newTab && newTab.getId() && !newTab.content) {
                        if (me.asyncTabs[newTab.getId()] && me.asyncTabs[newTab.getId()].tabActivatedCallback) {
                            me.asyncTabs[newTab.getId()].tabActivatedCallback(me._model.uuid, newTab, me._model);
                        }
                    }
                });
            }
        },

        addActionLinks: function() {
            var me = this,
                locale = me.locale,
                model = me._model,
                links;
            if(!me.instance.conf.hideMetadataXMLLink || me.instance.conf.hideMetadataXMLLink !== true) {
                entry = jQuery('<a></a>');
                entry.html(locale.xml);
                entry.attr('href', model.metadataURL);
                entry.attr('target', '_blank');
                links = entry;
            }

            if(!me.instance.conf.hideMetaDataPrintLink || me.instance.conf.hideMetaDataPrintLink !== true) {
                entry = jQuery('<a></a>');
                entry.html(locale.pdf);
                entry.attr(
                    'href',
                    '/catalogue/portti-metadata-printout-service/' +
                    'MetadataPrintoutServlet?lang=' + Oskari.getLang() +
                    '&title=' + me.locale.metadata_printout_title +
                    '&metadataresourceuuid=' + me._model.fileIdentifier
                );
                entry.attr('target', '_blank');
                if(links){
                    links = links.add(entry);
                } else {
                    links = entry;
                }
            }
            if(!me.instance.conf.hideShowCoverageLink || me.instance.conf.hideShowCoverageLink !== true) {
                if (me._model.geom) {
                    entry = jQuery('<a/>');
                    entry.addClass('metadata_coverage_bbox_link');
                    entry.attr('href','javascript:void(0)');
                    entry.html(me.instance._locale.flyout.coverage.showBBOX);


                    if(links){
                        links = links.add(entry);
                    } else {
                        links = entry;
                    }
                }
            }
            me.addActions(links);

            //Add click handler for the show coverage - link (under both metadata tab & actions tab)
            jQuery('.metadata_coverage_bbox_link').on('click', function() {
                me.toggleCoverage(jQuery(this));
            });

            //set rating stars if available (an administrator has rated the metadata)
            if (me._model.latestAdminRating) {
                me.getMetadataTabRatingStars();
            }
        },
        getMetadataTabRatingStars: function() {
            var me = this;
            //obtain a reference to metadatafeedback bundle, which contains the rating functionality... Update rating stars if exists...
            var metadataFeedbackBundle = me.instance.sandbox.findRegisteredModuleInstance("catalogue.bundle.metadatafeedback");
            if (metadataFeedbackBundle) {
                jQuery('div.metadata-feedback-rating').html(metadataFeedbackBundle._getAdminMetadataRating(me._model.latestAdminRating)+"&nbsp;");
                jQuery('div.metadatatab-rating-container').show();
            } else {
                jQuery('div.metadatatab-rating-container').hide();
            }
        },
        /**
         * @method addActions
         *
         * set up actions tab content based on conf
         */
        addActions: function(links) {
            var me = this,
                container = me._tabs['actions'].getContainer();
            _.each(links, function(link) {
                container.append(link);
                container.append('<br/>');
            });
        },
        toggleCoverage: function(entry) {
            var me = this,
                coverageVisible = entry.hasClass('metadata-coverage-visible');
            var style = {
                stroke: {
                    color: 'rgba(211, 187, 27, 0.8)',
                    width: 2
                },
                fill: {
                    color: 'rgba(255,222,0, 0.6)'
                }
            };

            if (coverageVisible) {
                jQuery('a.metadata_coverage_bbox_link')
                    .removeClass('metadata-coverage-visible')
                    .html(me.instance._locale.flyout.coverage.showBBOX);

                var rn = 'MapModulePlugin.RemoveFeaturesFromMapRequest';
                me.instance.sandbox.postRequestByName(rn, null);
            } else {
                jQuery('a.metadata_coverage_bbox_link')
                    .addClass('metadata-coverage-visible')
                    .html(me.instance._locale.flyout.coverage.removeBBOX);

                var rn = 'MapModulePlugin.AddFeaturesToMapRequest';
                me.instance.sandbox.postRequestByName(rn, [me._model.geom, {
                    layerId: 'METADATACATALOGUE_VECTORLAYER',
                    clearPrevious: true,
                    layerOptions: null,
                    centerTo: true,
                    featureStyle: style
                }]);
            }

        },
        renderMapLayerList: function() {
            var me = this,
                container = me._tabs['actions'].getContainer(),
                layers = me._maplayerService.getLayersByMetadataId(me._model.uuid),
                layerListHeader;
            container.find('table.metadataSearchResult').remove();
            container.append(me._templates['layerList']());

            layerListHeader = (layers && layers.length > 0) ? me.locale.layerList.title : "";
            container.find('h2').html(layerListHeader);

            layerListElement = container.find('ul.layerList');
            _.each(layers, function(layer) {
                var layerListItem = jQuery(me._templates['layerItem']({
                    layer: layer,
                    hidden: (!me.isLayerSelected(layer) || !layer.isVisible()),
                    locale: me.locale
                }));
                layerListElement.append(layerListItem);

                jQuery(layerListItem).find('a.layerLink').on('click', function() {
                    var labelText = me._toggleMapLayerVisibility(layer);
                    jQuery(this).html(labelText);
                });
            });
        },
        /**
         * @method @private _toggleMapLayerVisibility
         *
         * add / remove map layer from map and turn visible.
         * return labeltext to show / hide maplayer
         */
        _toggleMapLayerVisibility: function(layer) {
            var me = this,
                labelText;
            //not added -> add.
            if (me.isLayerSelected(layer) && layer.isVisible()) {
                //added -> remove from map
                me.instance.sandbox.postRequestByName('RemoveMapLayerRequest', [layer.getId()]);
                labelText = me.locale.layerList.show;
            } else {
                me.instance.sandbox.postRequestByName('AddMapLayerRequest', [layer.getId()]);
                //turn visible in case was invisible
                if (!layer.isVisible()) {
                    me.instance.sandbox.postRequestByName('MapModulePlugin.MapLayerVisibilityRequest', [layer.getId(), true]);
                }
                labelText = me.locale.layerList.hide;
            }
            return labelText;
        },
        isLayerSelected: function(layer) {
            var me = this,
                selectedLayers = me.instance.sandbox.findAllSelectedMapLayers();
            for (var k = 0; k < selectedLayers.length; k += 1) {
                selectedLayer = selectedLayers[k];
                if (layer.getId() === selectedLayer.getId()) {
                    return true;
                }
            }
            return false;
        },
        /**
         * @public @method getState
         *
         * @return {Object} state
         */
        getState: function () {
            return this.state;
        },

        /**
         * @public @method setState
         *
         * @param {Object} state
         *
         */
        setState: function (state) {
            this.state = state;
        },

        /**
         * @method destroy
         * Destroys the panel/removes it from document
         *
         *
         */
        destroy: function () {
            if (this._tabContainer && this._tabContainer.destroy) {
                this._tabContainer.destroy();
            }
            this.html.remove();
        }
    }, {
        extend: ['Oskari.userinterface.component.AccordionPanel']
    });
