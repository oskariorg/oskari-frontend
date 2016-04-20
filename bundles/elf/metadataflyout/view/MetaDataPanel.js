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

        /**
         * @static @private @property _templates HTML/underscore templates for the User Interface
         */
        this._templates = {
            // TODO add ifExists type of thing to all of these...
            tabs: {
                'title': _.template(
                    '<article>' +
                    '    <% _.forEach(identification.browseGraphics, function (graphic) { %>' +
                    '        <div class="browseGraphic">' +
                    '            <img src="<%- graphic.fileName %>" />' +
                    '        </div>' +
                    '    <% }); %>' +


                    '    <% if (identification.abstractText.length) { %>' +
                    '        <h2><%= identification.type === "data" ? locale.heading.abstractTextData : locale.heading.abstractTextService %></h2>' +
                    '        <% _.forEach(identification.abstractText, function (paragraph) { %>' +
                    '            <p><%= paragraph %></p>' +
                    '        <% }); %>' +
                    '    <% } %>' +

                    '    <% if (metadataDateStamp.length) { %>' +
                    '        <h2>' + this.locale.heading.metadataDateStamp + '</h2>' +
                    '        <p><%- metadataDateStamp %></p>' +
                    '    <% } %>' +
                    
                    '    <% if (onlineResources.length) { %>' +
                    '        <h2>' + this.locale.heading.onlineResource + '</h2>' +
                    '        <ul>' +
                    '        <% _.forEach(onlineResources, function (onlineResource) { %>' +
                    '            <% if (onlineResource.url.length) { %>' +
                    '                <li><a href="<%= onlineResource.url %>"><%= onlineResource.name && onlineResource.name.length ? onlineResource.name : onlineResource.url %></a></li>' +
                    '            <% } %>' +
                    '        <% }); %>' +
                    '        </ul>' +
                    '    <% } %>' +

                    '    <% if (identification.languages.length) { %>' +
                    '        <h2>' + this.locale.heading.resourceLanguage + '</h2>' +
                    '        <ul>' +
                    '        <% _.forEach(identification.languages, function (language) { %>' +
                    '             <li><%= locale.languages[language] || language %></li>' +
                    '        <% }); %>' +
                    '        </ul>' +
                    '    <% } %>' +

                    '    <% if (identification.topicCategories.length) { %>' +
                    '        <h2>' + this.locale.heading.topicCategory + '</h2>' +
                    '        <ul>' +
                    '        <% _.forEach(identification.topicCategories, function (topicCategory) { %>' +
                    '            <li title="<%= (locale.codeLists["gmd:MD_TopicCategoryCode"][topicCategory] || {description: topicCategory}).description %>"><%= (locale.codeLists["gmd:MD_TopicCategoryCode"][topicCategory] || {label: topicCategory}).label %></li>' +
                    '        <% }); %>' +
                    '        </ul>' +
                    '    <% } %>' +

                    '    <% if (identification.temporalExtents.length) { %>' +
                    '        <h2>' + this.locale.heading.temporalExtent + '</h2>' +
                    '        <ul>' +
                    '        <% _.forEach(identification.temporalExtents, function (temporalExtent) { %>' +
                    '            <li><%= temporalExtent.begin %> - <%= temporalExtent.end %></li>' +
                    '        <% }); %>' +
                    '        </ul>' +
                    '    <% } %>' +

                    '    <% if (dataQualities.some(function (dq) {return dq.lineageStatement.length})) { %>' +
                    '        <h2>' + this.locale.heading.lineageStatement + '</h2>' +
                    '        <% _.forEach(dataQualities, function (dataQuality) { %>' +
                    '            <% _.forEach(dataQuality.lineageStatement, function (paragraph) { %>' +
                    '                <p><%= paragraph %></p>' +
                    '            <% }); %>' +
                    '        <% }); %>' +
                    '    <% } %>' +

                    '    <% if (identification.spatialResolutions.length) { %>' +
                    '        <h2>' + this.locale.heading.spatialResolution + '</h2>' +
                    '        <ul>' +
                    '        <% _.forEach(identification.spatialResolutions, function (resolution) { %>' +
                    '            <li>1: <%- resolution %></li>' +
                    '        <% }); %>' +
                    '        </ul>' +
                    '    <% } %>' +

                    '    <% if (identification.responsibleParties.length) { %>' +
                    '        <h2>' + this.locale.heading.responsibleParty + '</h2>' +
                    '        <ul>' +
                    '        <% _.forEach(identification.responsibleParties, function (responsibleParty) { %>' +
                    '            <li><%- responsibleParty.organisationName %></li>' +
                    '            <% if (responsibleParty.electronicMailAddresses.length) { %>' +
                    '                <ul>' +
                    '                <% _.forEach(responsibleParty.electronicMailAddresses, function (electronicMailAddress) { %>' +
                    '                    <li><%- electronicMailAddress %></li>' +
                    '                <% }); %>' +
                    '                </ul>' +
                    '            <% } %>' +
                    '        </li>' +
                    '        <% }); %>' +
                    '        </ul>' +
                    '    <% } %>' +

                    '    <% if (identification.citation.date.date.length) { %>' +
                    '        <h2>' + this.locale.heading.citationDate + '</h2>' +
                    '        <p title="<%= (locale.codeLists["gmd:CI_DateTypeCode"][identification.citation.date.dateType] || {description: identification.citation.date.dateType}).description %>"><%- identification.citation.date.date %> (<%=' +
                    '        (locale.codeLists["gmd:CI_DateTypeCode"][identification.citation.date.dateType] || {label: identification.citation.date.dateType}).label' +
                    '        %>)</p>' +
                    '    <% } %>' +

                    '    <% if (distributionFormats.length) { %>' +
                    '        <h2>' + this.locale.heading.distributionFormat + '</h2>' +
                    '        <ul>' +
                    '        <% _.forEach(distributionFormats, function (distributionFormat) { %>' +
                    '            <li><%- distributionFormat.name %> <%= distributionFormat.version ? "(" + distributionFormat.version + ")" : "" %></li>' +
                    '        <% }); %>' +
                    '        </ul>' +
                    '    <% } %>' +

                    '    <% if (identification.spatialRepresentationTypes.length) { %>' +
                    '        <h2>' + this.locale.heading.spatialRepresentationType + '</h2>' +
                    '        <ul>' +
                    '        <% _.forEach(identification.spatialRepresentationTypes, function (spatialRepresentationType) { %>' +
                    '            <li title="<%= (locale.codeLists["gmd:MD_SpatialRepresentationTypeCode"][spatialRepresentationType] || {description: spatialRepresentationType}).description %>"><%= (locale.codeLists["gmd:MD_SpatialRepresentationTypeCode"][spatialRepresentationType] || {label: spatialRepresentationType}).label %></li>' +
                    '        <% }); %>' +
                    '        </ul>' +
                    '    <% } %>' +

                    '    <% if (fileIdentifier.length) { %>' +
                    '        <h2>' + this.locale.heading.fileIdentifier + '</h2>' +
                    '        <p><%- fileIdentifier %></p>' +
                    '    <% } %>' +

                    '    <% if (metadataStandardName.length) { %>' +
                    '        <h2>' + this.locale.heading.metadataStandardName + '</h2>' +
                    '        <p><%- metadataStandardName %></p>' +
                    '    <% } %>' +

                    '    <% if (metadataStandardVersion.length) { %>' +
                    '        <h2>' + this.locale.heading.metadataStandardVersion + '</h2>' +
                    '        <p><%- metadataStandardVersion %></p>' +
                    '    <% } %>' +

                    '    <% if (metadataLanguage.length) { %>' +
                    '        <h2>' + this.locale.heading.metadataLanguage + '</h2>' +
                    '        <p><%= locale.languages[metadataLanguage] || metadataLanguage %></p>' +
                    '    <% } %>' +

                    '    <% if (metadataCharacterSet.length) { %>' +
                    '        <h2>' + this.locale.heading.metadataCharacterSet + '</h2>' +
                    '        <p title="<%= (locale.codeLists["gmd:MD_CharacterSetCode"][metadataCharacterSet] || {description: metadataCharacterSet}).description %>"><%= (locale.codeLists["gmd:MD_CharacterSetCode"][metadataCharacterSet] || {label: metadataCharacterSet}).label %></p>' +
                    '    <% } %>' +

                    '    <% if (metadataResponsibleParties.length) { %>' +
                    '    <h2>' + this.locale.heading.metadataOrganisation + '</h2>' +
                    '        <ul>' +
                    '        <% _.forEach(metadataResponsibleParties, function (metadataResponsibleParty) { %>' +
                    '            <li><%- metadataResponsibleParty.organisationName %>' +
                    '            <% if (metadataResponsibleParty.electronicMailAddresses.length) { %>' +
                    '                <ul>' +
                    '                <% _.forEach(metadataResponsibleParty.electronicMailAddresses, function (electronicMailAddress) { %>' +
                    '                    <li><%- electronicMailAddress %></li>' +
                    '                <% }); %>' +
                    '                </ul>' +
                    '            <% } %>' +
                    '        </li>' +
                    '        <% }); %>' +
                    '        </ul>' +
                    '    <% } %>' +
                    
                    '    <% if (scopeCodes.length) { %>' +
                    '        <h2>' + this.locale.heading.scopeCode + '</h2>' +
                    '        <ul>' +
                    '        <% _.forEach(scopeCodes, function (scopeCode) { %>' +
                    '            <li title="<%= (locale.codeLists["gmd:MD_ScopeCode"][scopeCode] || {description: scopeCode}).description %>"><%= (locale.codeLists["gmd:MD_ScopeCode"][scopeCode] || {label: scopeCode}).label %></li>' +
                    '        <% }); %>' +
                    '        </ul>' +
                    '    <% } %>' +

                    '    <% if (identification.citation.resourceIdentifiers.length) { %>' +
                    '        <h2>' + this.locale.heading.resourceIdentifier + '</h2>' +
                    '        <ul>' +
                    '        <% _.forEach(identification.citation.resourceIdentifiers, function (resourceIdentifier) { %>' +
                    '            <li><%- resourceIdentifier.codeSpace %>.<%- resourceIdentifier.code %></li>' +
                    '        <% }); %>' +
                    '        </ul>' +
                    '    <% } %>' +

                    '    <% if (identification.operatesOn.length) { %>' +
                    '        <h2>' + this.locale.heading.operatesOn + '</h2>' +
                    '        <ul>' +
                    '        <% _.forEach(identification.operatesOn, function (uuid) { %>' +
                    '            <li><%- uuid %></li>' +
                    '        <% }); %>' +
                    '        </ul>' +
                    '    <% } %>' +

                    '    <% if (identification.serviceType.length) { %>' +
                    '        <h2>' + this.locale.heading.serviceType + '</h2>' +
                    '        <p><%- identification.serviceType %> <%= identification.serviceTypeVersion ? "(" + identification.serviceTypeVersion + ")" : "" %></p>' +
                    '    <% } %>' +

                    '    <% if (identification.descriptiveKeywords.length) { %>' +
                    '        <h2>' + this.locale.heading.descriptiveKeyword + '</h2>' +
                    '        <ul>' +
                    '        <% _.forEach(identification.descriptiveKeywords, function (keyword) { %>' +
                    '            <% if (keyword.length) { %>' +
                    '                <li><%- keyword %></li>' +
                    '            <% } %>' +
                    '        <% }); %>' +
                    '        </ul>' +
                    '    <% } %>' +

                    '    <% if (dataQualities.length) { %>' +
                    '        <h2>' + this.locale.heading.reportConformance + '</h2>' +
                    '        <% _.forEach(dataQualities, function (dataQuality) { %>' +
                    '            <% _.forEach(dataQuality.reportConformances, function (reportConformance) { %>' +
                    '                <p><%= reportConformance %></p>' +
                    '            <% }); %>' +
                    '        <% }); %>' +
                    '    <% } %>' +

                    '    <% if (identification.accessConstraints.length) { %>' +
                    '        <h2>' + this.locale.heading.accessConstraint + '</h2>' +
                    '        <ul>' +
                    '        <% _.forEach(identification.accessConstraints, function (accessConstraint) { %>' +
                    '            <li title="<%= (locale.codeLists["gmd:MD_RestrictionCode"][accessConstraint] || {description: accessConstraint}).description %>"><%= (locale.codeLists["gmd:MD_RestrictionCode"][accessConstraint] || {label: accessConstraint}).label %></li>' +
                    '        <% }); %>' +
                    '        </ul>' +
                    '    <% } %>' +

                    '    <% if (identification.otherConstraints.length) { %>' +
                    '        <h2>' + this.locale.heading.otherConstraint + '</h2>' +
                    '        <% _.forEach(identification.otherConstraints, function (otherConstraint) { %>' +
                    '            <% _.forEach(otherConstraint, function (paragraph) { %>' +
                    '                <p><%= paragraph %></p>' +
                    '            <% }); %>' +
                    '        <% }); %>' +
                    '    <% } %>' +

                    '    <% if (identification.classifications.length) { %>' +
                    '        <h2>' + this.locale.heading.classification + '</h2>' +
                    '        <ul>' +
                    '        <% _.forEach(identification.classifications, function (classification) { %>' +
                    '            <li title="<%= (locale.codeLists["gmd:MD_ClassificationCode"][classification] || {description: classification}).description %>"><%= (locale.codeLists["gmd:MD_ClassificationCode"][classification] || {label: classification}).label %></li>' +
                    '        <% }); %>' +
                    '        </ul>' +
                    '    <% } %>' +

                    '    <% if (identification.useLimitations.length) { %>' +
                    '        <h2>' + this.locale.heading.useLimitation + '</h2>' +
                    '        <% _.forEach(identification.useLimitations, function (useLimitation) { %>' +
                    '            <% _.forEach(useLimitation, function (paragraph) { %>' +
                    '                <p><%= paragraph %></p>' +
                    '            <% }); %>' +
                    '        <% }); %>' +
                    '    <% } %>' +
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
                )

            }
        };
    }, {
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
                links,
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
            for (tabId in me._templates.tabs) {
                if (me._templates.tabs.hasOwnProperty(tabId)) {
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
                        var newTabTitle = me._additionalTabs[tabId].title ? me._additionalTabs[tabId].title : "";
                        entry.setTitle(newTabTitle);
                        me._tabContainer.addTabChangeListener(function(previousTab, newTab) {
                            if (newTab && newTab.getId() && !newTab.content) {
                                if (me._additionalTabs[newTab.getId()] && me._additionalTabs[newTab.getId()].tabActivatedCallback) {
                                    me._additionalTabs[newTab.getId()].tabActivatedCallback(me._model.uuid, newTab);
                                }
                            }
                        });
                    }
                    me._tabContainer.addPanel(entry);
                    me._tabs[tabId] = entry;
                }
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

            if(!me.instance.conf.hideMetadataXMLLink || me.instance.conf.hideMetadataXMLLink !== true) {
                entry = jQuery('<a />');
                entry.html(locale.xml);
                entry.attr('href', model.metadataURL);
                entry.attr('target', '_blank');
                links = entry;
            }

            if(!me.instance.conf.hideMetaDataPrintLink || me.instance.conf.hideMetaDataPrintLink !== true) {
                entry = jQuery('<a />');
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

            me._tabContainer.setExtra(links);
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
            var me = this;
            me._additionalTabs = tabsJSON;
            for (var tabId in tabsJSON) {
                me._templates.tabs[tabId] = tabsJSON[tabId].template ? tabsJSON[tabId].template : null;
            }
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
