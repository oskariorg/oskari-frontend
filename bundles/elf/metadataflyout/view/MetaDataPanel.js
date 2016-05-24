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
                    //TODO: need to dig this stuff up from "somewhere"
                    /*
                    '       <tr>'+
                    '           <td>'+this.locale.tableHeaders.datasetInformation.bbox+'</td>'+
                    '           <td>TODO</td>'+
                    '       </tr>'+
                    '       <tr>'+
                    '           <td>'+this.locale.tableHeaders.datasetInformation.crs+'</td>'+
                    '           <td>TODO</td>'+
                    '       </tr>'+
                    */
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
                    '               <% _.forEach(dataQualities, function (dataQuality) { %>' +
                    '                   <% _.forEach(dataQuality.lineageStatement, function (paragraph) { %>' +
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
/*                    
                    //TODO: once we get the feedback stars
                    '   <hr class="elf-metadata-divider">'+
                    '   <h2>'+this.locale.heading.dataQuality+'</h2>'+
                    '   <table class="elf-metadata-table-no-border">'+
                    '       <tr>'+
                    '           <td>'+this.locale.tableHeaders.dataQuality.conformance+'</td>'+
                                //TODO: feedbackstars
                    '           <td>*****</td>'+ 
                    '       </tr>'+
                    '   </table>'+
*/                    
                    '</article>'
                ),
                'quality': _.template(
                    '<article>' +

                    '    <% if (dataQualities.some(function (dq) {return dq.lineageStatement.length})) { %>' +
                    '        <h2>' + this.locale.heading.lineageStatement + '</h2>' +
                    '        <% _.forEach(dataQualities, function (dataQuality) { %>' +
                    '            <% _.forEach(dataQuality.lineageStatement, function (paragraph) { %>' +
                    '                <p><%= paragraph %></p>' +
                    '            <% }); %>' +
                    '        <% }); %>' +
                    '    <% } %>' +
                    '    <% if (dataQualities.length) { %>' +
                    '        <% _.forEach(dataQualities, function (dataQuality) { %>' +
                    '           <% if (dataQuality.absoluteExternalPositionalAccuracyList.length) { %>' +
                    '               <h2>' + this.locale.heading.absoluteExternalPositionalAccuracy + '</h2>' +
                    '               <% _.forEach(dataQuality.absoluteExternalPositionalAccuracyList, function(dataQualityItem) { %>'+
                    '                   <% _.forEach(dataQualityItem.list, function (item) { %>' +
                    '                       <p><%= item %></p>' +
                    '                   <% }); %>' +
                    '                   <% if (dataQualityItem.pass == "true") {%><p><%=locale.qualityContent.qualityPassTrue%></p><%} else { %> <p><%=locale.qualityContent.qualityPassFalse%></p> <% } %> '+
                    '               <% }); %> '+
                    '           <% } %>'+
                    '           <% if (dataQuality.accuracyOfTimeMeasurementList.length) { %>' +
                    '               <h2>' + this.locale.heading.accuracyOfTimeMeasurement + '</h2>' +
                    '               <% _.forEach(dataQuality.accuracyOfTimeMeasurementList, function (dataQualityItem) { %>' +
                    '                   <% _.forEach(dataQualityItem.list, function (item) { %>' +
                    '                      <p><%= item %></p>' +
                    '                  <% }); %>' +
                    '                  <% if (dataQualityItem.pass == "true") {%><p><%=locale.qualityContent.qualityPassTrue%></p><%} else { %> <p><%=locale.qualityContent.qualityPassFalse%></p> <% } %> '+
                    '              <% }) %>' +
                    '           <% } %>'+
                    '           <% if (dataQuality.completenessCommissionList.length) { %>' +
                    '               <h2>' + this.locale.heading.completenessCommission + '</h2>' +
                    '               <% _.forEach(dataQuality.completenessCommissionList, function (dataQualityItem) { %>' +
                    '                   <% _.forEach(dataQualityItem.list, function (item) { %>' +
                    '                       <p><%= item %></p>' +
                    '                   <% }); %>' +
                    '                   <% if (dataQualityItem.pass == "true") {%><p><%=locale.qualityContent.qualityPassTrue%></p><%} else { %> <p><%=locale.qualityContent.qualityPassFalse%></p> <% } %> '+
                    '               <% }); %>' +
                    '           <% } %>'+
                    '           <% if (dataQuality.completenessOmissionList.length) { %>' +
                    '              <h2>' + this.locale.heading.completenessOmission + '</h2>' +
                    '               <% _.forEach(dataQuality.completenessOmissionList, function (dataQualityItem) { %>' +
                    '                  <% _.forEach(dataQualityItem.list, function (item) { %>' +
                    '                      <p><%= item %></p>' +
                    '                  <% }); %>' +
                    '                  <% if (dataQualityItem.pass == "true") {%><p><%=locale.qualityContent.qualityPassTrue%></p><%} else { %> <p><%=locale.qualityContent.qualityPassFalse%></p> <% } %> '+
                    '               <% }); %>' +
                    '           <% } %>'+
                    '           <% if (dataQuality.conceptualConsistencyList.length) { %>' +
                    '               <h2>' + this.locale.heading.conceptualConsistency + '</h2>' +
                    '               <% _.forEach(dataQuality.conceptualConsistencyList, function (dataQualityItem) { %>' +
                    '                  <% _.forEach(dataQualityItem.list, function (item) { %>' +
                    '                      <p><%= item %></p>' +
                    '                  <% }); %>' +
                    '                  <% if (dataQualityItem.pass == "true") {%><p><%=locale.qualityContent.qualityPassTrue%></p><%} else { %> <p><%=locale.qualityContent.qualityPassFalse%></p> <% } %> '+
                    '               <% }); %>' +
                    '           <% } %>'+
                    '           <% if (dataQuality.domainConsistencyList.length) { %>' +
                    '               <h2>' + this.locale.heading.domainConsistency + '</h2>' +
                    '               <% _.forEach(dataQuality.domainConsistencyList, function (dataQualityItem) { %>' +
                    '                  <% _.forEach(dataQualityItem.list, function (item) { %>' +
                    '                      <p><%= item %></p>' +
                    '                  <% }); %>' +
                    '                  <% if (dataQualityItem.pass == "true") {%><p><%=locale.qualityContent.qualityPassTrue%></p><%} else { %> <p><%=locale.qualityContent.qualityPassFalse%></p> <% } %> '+
                    '               <% }); %>' +
                    '           <% } %>'+
                    '           <% if (dataQuality.formatConsistencyList.length) { %>' +
                    '               <h2>' + this.locale.heading.formatConsistency + '</h2>' +
                    '               <% _.forEach(dataQuality.formatConsistencyList, function (dataQualityItem) { %>' +
                    '                 <% _.forEach(dataQualityItem.list, function (item) { %>' +
                    '                    <p><%= item %></p>' +
                    '                 <% }); %>' +
                    '                 <% if (dataQualityItem.pass == "true") {%><p><%=locale.qualityContent.qualityPassTrue%></p><%} else { %> <p><%=locale.qualityContent.qualityPassFalse%></p> <% } %> '+
                    '               <% }); %>' +
                    '           <% } %>'+
                    '           <% if (dataQuality.griddedDataPositionalAccuracyList.length) { %>' +
                    '              <h2>' + this.locale.heading.griddedDataPositionalAccuracy + '</h2>' +
                    '               <% _.forEach(dataQuality.griddedDataPositionalAccuracyList, function (dataQualityItem) { %>' +
                    '                   <% _.forEach(dataQualityItem.list, function (item) { %>' +
                    '                      <p><%= item %></p>' +
                    '                   <% }); %>' +
                    '                   <% if (dataQualityItem.pass == "true") {%><p><%=locale.qualityContent.qualityPassTrue%></p><%} else { %> <p><%=locale.qualityContent.qualityPassFalse%></p> <% } %> '+
                    '               <% }); %>' +
                    '           <% } %>'+
                    '           <% if (dataQuality.nonQuantitativeAttributeAccuracyList.length) { %>' +
                    '              <h2>' + this.locale.heading.nonQuantitativeAttributeAccuracy + '</h2>' +
                    '              <% _.forEach(dataQuality.nonQuantitativeAttributeAccuracyList, function (dataQualityItem) { %>' +
                    '                  <% _.forEach(dataQualityItem.list, function (item) { %>' +
                    '                      <p><%= item %></p>' +
                    '                  <% }); %>' +
                    '                  <% if (dataQualityItem.pass == "true") {%><p><%=locale.qualityContent.qualityPassTrue%></p><%} else { %> <p><%=locale.qualityContent.qualityPassFalse%></p> <% } %> '+
                    '              <% }); %>' +
                    '           <% } %>'+
                    '           <% if (dataQuality.quantitativeAttributeAccuracyList.length) { %>' +
                    '              <h2>' + this.locale.heading.quantitativeAttributeAccuracy + '</h2>' +
                    '              <% _.forEach(dataQuality.quantitativeAttributeAccuracyList, function (dataQualityItem) { %>' +
                    '                  <% _.forEach(dataQualityItem.list, function (item) { %>' +
                    '                      <p><%= item %></p>' +
                    '                  <% }); %>' +
                    '                  <% if (dataQualityItem.pass == "true") {%><p><%=locale.qualityContent.qualityPassTrue%></p><%} else { %> <p><%=locale.qualityContent.qualityPassFalse%></p> <% } %> '+
                    '              <% }); %>' +
                    '           <% } %>'+
                    '           <% if (dataQuality.relativeInternalPositionalAccuracyList.length) { %>' +
                    '               <h2>' + this.locale.heading.relativeInternalPositionalAccuracy + '</h2>' +
                    '               <% _.forEach(dataQuality.relativeInternalPositionalAccuracyList, function (dataQualityItem) { %>' +
                    '                   <% _.forEach(dataQualityItem.list, function (item) { %>' +
                    '                       <p><%= item %></p>' +
                    '                   <% }); %>' +
                    '                   <% if (dataQualityItem.pass == "true") {%><p><%=locale.qualityContent.qualityPassTrue%></p><%} else { %> <p><%=locale.qualityContent.qualityPassFalse%></p> <% } %> '+
                    '               <% }); %>' +
                    '           <% } %>'+
                    '           <% if (dataQuality.temporalConsistencyList.length) { %>' +
                    '               <h2>' + this.locale.heading.temporalConsistency + '</h2>' +
                    '               <% _.forEach(dataQuality.temporalConsistencyList, function (dataQualityItem) { %>' +
                    '                   <% _.forEach(dataQualityItem.list, function (item) { %>' +
                    '                       <p><%= item %></p>' +
                    '                   <% }); %>' +
                    '                   <% if (dataQualityItem.pass == "true") {%><p><%=locale.qualityContent.qualityPassTrue%></p><%} else { %> <p><%=locale.qualityContent.qualityPassFalse%></p> <% } %> '+
                    '               <% }); %>' +
                    '           <% } %>'+
                    '           <% if (dataQuality.temporalValidityList.length) { %>' +
                    '               <h2>' + this.locale.heading.temporalValidity + '</h2>' +
                    '               <% _.forEach(dataQuality.temporalValidityList, function (dataQualityItem) { %>' +
                    '                   <% _.forEach(dataQualityItem.list, function (item) { %>' +
                    '                       <p><%= item %></p>' +
                    '                   <% }); %>' +
                    '                   <% if (dataQualityItem.pass == "true") {%><p><%=locale.qualityContent.qualityPassTrue%></p><%} else { %> <p><%=locale.qualityContent.qualityPassFalse%></p> <% } %> '+
                    '               <% }); %>' +
                    '           <% } %>'+
                    '           <% if (dataQuality.thematicClassificationCorrectnessList.length) { %>' +
                    '               <h2>' + this.locale.heading.thematicClassificationCorrectness + '</h2>' +
                    '               <% _.forEach(dataQuality.thematicClassificationCorrectnessList, function (dataQualityItem) { %>' +
                    '                   <% _.forEach(dataQualityItem.list, function (item) { %>' +
                    '                       <p><%= item %></p>' +
                    '                   <% }); %>' +
                    '                   <% if (dataQualityItem.pass == "true") {%><p><%=locale.qualityContent.qualityPassTrue%></p><%} else { %> <p><%=locale.qualityContent.qualityPassFalse%></p> <% } %> '+
                    '               <% }); %>' +
                    '           <% } %>'+
                    '           <% if (dataQuality.topologicalConsistencyList.length) { %>' +
                    '               <h2>' + this.locale.heading.topologicalConsistency + '</h2>' +
                    '               <% _.forEach(dataQuality.topologicalConsistencyList, function (dataQualityItem) { %>' +
                    '                  <% _.forEach(dataQualityItem.list, function (item) { %>' +
                    '                       <p><%= item %></p>' +
                    '                   <% }); %>' +
                    '                   <% if (dataQualityItem.pass == "true") {%><p><%=locale.qualityContent.qualityPassTrue%></p><%} else { %> <p><%=locale.qualityContent.qualityPassFalse%></p> <% } %> '+
                    '               <% }); %>' +
                    '           <% } %>'+
                    '       <br/><br/>'+
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
            var additionalTabsFound = false;
            for (tabId in me._templates.tabs) {
                if (me._templates.tabs.hasOwnProperty(tabId)) {

                    //only show quality tab for services and datasets
                    //TODO: maybe make this a configurable thing at some point instead of hardcoding...
                    if (tabId === 'quality' && (model.identification.type !== 'series' && model.identification.type !== 'data')) {
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
                    } else if (me._additionalTabs && me._additionalTabs[tabId] && me._additionalTabs[tabId].tabActivatedCallback) {
                        additionalTabsFound = true;
                        var newTabTitle = me._additionalTabs[tabId].title ? me._additionalTabs[tabId].title : "";
                        entry.setTitle(newTabTitle);
                    }
                    me._tabContainer.addPanel(entry);
                    me._tabs[tabId] = entry;

                }
            }

            /*add the tab change event listener only once.*/
            if (additionalTabsFound) {
                me._tabContainer.addTabChangeListener(function(previousTab, newTab) {
                    if (newTab && newTab.getId() && !newTab.content) {
                        if (me._additionalTabs[newTab.getId()] && me._additionalTabs[newTab.getId()].tabActivatedCallback) {
                            me._additionalTabs[newTab.getId()].tabActivatedCallback(me._model.uuid, newTab, me._model);
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
            //TODO: adding dynamically _after_ I've already been rendered...
            var me = this;
            me._additionalTabs = tabsJSON;
            for (var tabId in tabsJSON) {
                me._templates.tabs[tabId] = tabsJSON[tabId].template ? tabsJSON[tabId].template : null;
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
            me.addActions(links);
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
                me.instance.sandbox.postRequestByName('AddMapLayerRequest', [layer.getId(), layer.isVisible()]);
                //turn visible in case was invisible
                if (!layer.isVisible()) {
                    me.instance.sandbox.postRequestByName('MapModulePlugin.MapLayerVisibilityRequest', [layer.getId(), true]);
                }
                labelText = me.locale.layerList.hide;
            }
            return labelText;
        },
        _toggleMetadataCoverage: function() {
            var me = this;
            me._model;

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
