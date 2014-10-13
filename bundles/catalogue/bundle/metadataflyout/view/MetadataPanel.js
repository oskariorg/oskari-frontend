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
                'abstract': _.template(
                    '<article>' +
                    '    <% _.forEach(identification.browseGraphics, function (graphic) { %>' +
                    '        <div class="browseGraphic" style="display: none;">' +
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
                    '        <div class="browseGraphic" style="display: none;">' +
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
                    '        <div class="browseGraphic" style="display: none;">' +
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
                showImage = function () {
                    browseGraphics.find(
                        'img[src="' + this.src + '"]').parent().css({
                        display: ''
                    });
                },
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
                    entry.setTitle(locale[tabId]);
                    entry.setContent(
                        me._templates.tabs[tabId](model)
                    );
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
                images[i].onload = showImage;
                images[i].src = identification.browseGraphics[i].fileName;
            }

            entry = jQuery('<a />');
            entry.html(locale.xml);
            entry.attr('href', model.metadataURL);
            entry.attr('target', '_blank');
            links = entry;
            
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
            links = links.add(entry);

            me._tabContainer.setExtra(links);
            me.setTitle(me._model.identification.citation.title);
            if (open) {
                me.open();
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
