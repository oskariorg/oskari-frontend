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
                'abstract': _.template(
                    '<article>' +
                    '    <% _.forEach(identification.browseGraphics, function (graphic) { %>' +
                    '        <div class="browseGraphic">' +
                    '            <img src="<%- graphic.fileName %>" />' +
                    '        </div>' +
                    '    <% }); %>' +

                    '    <% if (identification.citation.title.length) { %>' +
                    '        <h1><%- identification.citation.title %></h1>' +
                    '    <% } %>' +

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
                    '</article>'
                ),

                'jhs': _.template(
                    '<article>' +
                    '    <% _.forEach(identification.browseGraphics, function (graphic) { %>' +
                    '        <div class="browseGraphic">' +
                    '            <img src="<%- graphic.fileName %>" />' +
                    '        </div>' +
                    '    <% }); %>' +

                    '    <% if (identification.citation.title.length) { %>' +
                    '        <h1><%- identification.citation.title %></h1>' +
                    '    <% } %>' +

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
                    '</article>'
                ),

                'inspire': _.template(
                    '<article>' +
                    '    <% _.forEach(identification.browseGraphics, function (graphic) { %>' +
                    '        <div class="browseGraphic">' +
                    '            <img src="<%- graphic.fileName %>" />' +
                    '        </div>' +
                    '    <% }); %>' +

                    '    <% if (identification.citation.title.length) { %>' +
                    '        <h1><%- identification.citation.title %></h1>' +
                    '    <% } %>' +

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
                    // TODO I think these used to be links...
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
                    '    <% if (dataQualityObject.dataQualityNodes.length) { %>' +
                    '        <% _.forEach(dataQualityObject.dataQualityNodes, function (dataQuality) { %>' +
                    '           <br> <h2> ${dataQuality.UIlabel}</h2>' +
                    '           <% if (dataQuality.linageStatement) { %>' +
                                    this.locale.heading.lineageStatement + ' : <%= dataQuality.linageStatement %> <br>' +
                    '           <% } %>' +
                    '           <% if (dataQuality.nameOfMeasure) { %>' +
                                    this.locale.qualityContent.nameOfMeasure + ' : <%= dataQuality.nameOfMeasure %> <br>' +
                    '           <% } %>' +
                    '           <% if (dataQuality.measureDescription) { %>' +
                                    this.locale.qualityContent.measureDescription + ' : <%= dataQuality.measureDescription %> <br>' +
                    '           <% } %>' +
                    '           <% if (dataQuality.evaluationMethodType) { %>' +
                                    this.locale.qualityContent.evaluationMethodType + ' : <%= dataQuality.evaluationMethodType %> <br>' +
                    '           <% } %>' +
                    '           <% if (dataQuality.measureIdentificationAuthorization) { %>' +
                                    this.locale.qualityContent.measureIdentificationAuthorization + ' : <%= dataQuality.measureIdentificationAuthorization %> <br>' +
                    '           <% } %>' +
                    '           <% if (dataQuality.measureIdentificationCode) { %>' +
                                   this.locale.qualityContent.measureIdentificationCode + ' : <%= dataQuality.measureIdentificationCode %> <br>' +
                    '           <% } %>' +
                    '           <% if (dataQuality.dateTime.length) { %>' +
                    '               <% _.forEach(dataQuality.dateTime, function (dateTime) { %>' +
                    '                   <% if (dateTime) { %>' +
                                            this.locale.qualityContent.dateTime + ' : <%= dateTime %> <br>' +
                    '                   <% } %>' +
                    '               <% }); %> '+
                    '           <% } %>' +
                    '           <% if (dataQuality.conformanceResultList.length) { %>' +
                    '               <br> <h3>' + this.locale.qualityContent.conformanceResult + '</h3>' +
                    '               <% _.forEach(dataQuality.conformanceResultList, function (conformanceResult) { %>' +
                    '                   <% if (conformanceResult.specification) { %>' +
                                            this.locale.qualityContent.specification + ': <%= conformanceResult.specification %> <br>' +
                    '                   <% } %>' +
                    '                   <% if (conformanceResult.pass == "true") {%> <%=locale.qualityContent.qualityPassTrue%><br><%}' +
                    '                       else { %> <%=locale.qualityContent.qualityPassFalse%> <br> <% } %> '+
                    '                   <% if (conformanceResult.explanation) { %>' +
                                            this.locale.qualityContent.explanation + ': <%= conformanceResult.explanation %> <br>' +
                    '                   <% } %>' +
                    '               <% }); %> '+
                    '           <% } %>' +
                    '           <% if (dataQuality.quantitativeResultList.length) { %>' +
                    '               <br> <h3>' + this.locale.qualityContent.quantitativeResult + '</h3>' +
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

        preprocessModel : {
            'quality' : function(model) {
                if(!model.dataQualityObject || !model.dataQualityObject.dataQualityNodes || !model.dataQualityObject.dataQualityNodes.length) {
                    return model;
                };
                var loc = this.locale.heading;
                model.dataQualityObject.dataQualityNodes.forEach(function(dataQuality) {
                    dataQuality.UIlabel =  loc[dataQuality.nodeName];
                });
                return model;
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
                    entry = Oskari.clazz.create(
                        'Oskari.userinterface.component.TabPanel'
                    );
                    entry.setId(tabId);

                    //skip async tabs whose content comes from someplace else
                    if (me._templates.tabs[tabId]) {
                        //the "native" tabs have keys in this bundles locale
                        entry.setTitle(locale[tabId]);
                        if(me.preprocessModel[tabId]) {
                            me.preprocessModel[tabId].apply(me, [model]);
                        }
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

            for (var p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    me.instance.sandbox.registerForEventByName(this, p);
                }
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
                entry = jQuery('<a /><br/>');
                entry.html(locale.xml);
                entry.attr('href', model.metadataURL);
                entry.attr('target', '_blank');
                links = entry;
            }

            if(!me.instance.conf.hideMetaDataPrintLink || me.instance.conf.hideMetaDataPrintLink !== true) {
                entry = jQuery('<a /><br/>');
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
            });
        },

        renderMapLayerList: function() {
            var me = this,
                container = me._tabs['actions'].getContainer(),
                layers = me._maplayerService.getLayersByMetadataId(me._model.uuid);

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
