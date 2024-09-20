/**
 * @class Oskari.catalogue.bundle.metadataflyout.view.MetadataPage
 *
 *
 * This hosts metadata content loaded via ajax from
 * Geonetwork
 *
 * Embeds  metadata information.
 *
 */
Oskari.clazz.define('Oskari.catalogue.bundle.metadataflyout.view.MetadataPage',

    /**
     * @method create called automatically on construction
     * @static
     *
     */
    function (instance, locale) {
        /* @property instance bundle instance */
        this.instance = instance;

        /* @property locale locale for this */
        this.locale = locale;
        // We need lancode localizations...
        locale.languages =
            Oskari.getLocalization('DivManazer').LanguageSelect.languages;

        this.asyncTabs = {};
    }, {
        init: function () {},

        /**
         * @private @method _createContent
         * Creates actual tab content from fetched metadata and templates
         *
         * @param {Object} data
         *
         */
        _createContent: function (data) {
            const me = this;
            if (data === null || data === undefined) {
                throw new TypeError('_createContent(): missing data.');
            }
            const { identifications, ...template } = data;

            if (identifications.length === 0) {
                //  No identifications, show metadata not found message
                me._showMetadataNotFoundMessage();
            } else {
                // Create a panel for each identification
                for (let i = 0; i < identifications.length; i += 1) {
                    const identification = identifications[i];
                    const model = { ...template, identification };
                    const panel = Oskari.clazz.create(
                        'Oskari.catalogue.bundle.metadataflyout.view.MetadataPanel',
                        me.instance,
                        me.locale,
                        model
                    );
                    if (me.asyncTabs && !jQuery.isEmptyObject(me.asyncTabs)) {
                        panel.addTabs(me.asyncTabs);
                    }

                    me.addPanel(panel);
                    panel.init(i === 0);
                }
            }
        },

        addTabsAsync: function (data) {
            var me = this;

            if (me.panels && me.panels.length) {
                me.panels.forEach(panel => panel.addTabsAsync(data));
            } else {
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        me.asyncTabs[key] = data[key];
                    }
                }
            }
        },

        /**
         * @private @method _processJSON
         *
         * @param {Object} metadataJSON Metadata object
         *
         */
        _processJSON: function (metadataJson) {
            var me = this,
                data,
                dataTemplate,
                i,
                identificationTemplate;
            // underscore templates don't like missing values, so let's extend empty strings and arrays...
            dataTemplate = {
                lineageStatements: [],
                dataQualities: [],
                distributionFormats: [],
                fileIdentifier: '',
                identifications: [],
                metadataCharacterSet: '',
                metadataDateStamp: '',
                metadataLanguage: '',
                metadataOrganisationNames: [],
                metadataStandardName: '',
                metadataStandardVersion: '',
                onlineResources: [],
                scopeCodes: []
            };

            identificationTemplate = {
                abstractText: '',
                accessConstraints: [],
                browseGraphics: [],
                citation: {
                    date: {
                        date: '',
                        dateType: ''
                    },
                    resourceIdentifiers: [],
                    title: ''
                },
                classifications: [],
                descriptiveKeywords: [],
                languages: [],
                operatesOn: [],
                otherConstraints: [],
                responsibleParties: [],
                serviceType: '',
                spatialRepresentationTypes: [],
                spatialResolutions: [],
                temporalExtents: [],
                topicCategories: [],
                useLimitations: []
            };

            data = Oskari.util.deepClone(dataTemplate, metadataJson);

            data.lineageStatements.forEach(function (lineage, index) {
                data.lineageStatements[index] = me._prettify(lineage);
            });

            data.dataQualities.forEach(function (dataQuality) {
                dataQuality.UIlabel = me.locale.heading[dataQuality.nodeName];
            });

            for (i = 0; i < data.identifications.length; i += 1) {
                data.identifications[i] =
                    Oskari.util.deepClone(identificationTemplate, data.identifications[i]);
            }

            data.identifications.forEach(function (identification) {
                // Split abstract text to paragraphs and make links into anchors
                identification.abstractText =
                    me._prettify(identification.abstractText);

                if (!identification.browseGraphics) {
                    identification.browseGraphics = [];
                }

                if (!identification.citation) {
                    identification.citation = {};
                }

                if (identification.citation.title === undefined) {
                    identification.citation.title = '';
                }

                if (!identification.otherConstraints) {
                    identification.otherConstraints = [];
                }

                for (i = 0; i < identification.otherConstraints.length; i += 1) {
                    identification.otherConstraints[i] =
                        me._prettify(identification.otherConstraints[i]);
                }

                if (!identification.useLimitations) {
                    identification.useLimitations = [];
                }

                for (i = 0; i < identification.useLimitations.length; i += 1) {
                    identification.useLimitations[i] =
                        me._prettify(identification.useLimitations[i]);
                }
            });

            me._createContent(data);
        },

        /**
         * @private @method _prettify
         * Chops the text into paragraphs, makes links into anchors.
         *
         * @param {string} text Text
         *
         */
        _prettify: function (text) {
            var me = this,
                ret = [];
            if (text) {
                text.split('\n').forEach(
                    function (paragraph) {
                        ret.push(
                            me._linkify(paragraph.trim())
                        );
                    }
                );
            }
            return ret;
        },

        /**
         * @private @method _getMetadata
         * This is the actual data loader function
         *
         * @param {string} uuid UUID
         * @param {number} layerId layer id
         *
         */
        _getMetadata: function (uuid, layerId) {
            var me = this;

            if ((uuid === null || uuid === undefined) && (layerId === null || layerId === undefined)) {
                throw new TypeError(
                    '_getMetadata(): missing uuid and layerId'
                );
            }
            me.instance.getLoader().getCSWData(
                uuid,
                layerId,
                Oskari.getLang(),
                // TODO add sensible error handling
                function (data) {
                    me._processJSON(data);
                },
                function (jqXHR, exception) {
                    // Request failed, show generic message to user
                    me._showMetadataNotFoundMessage();
                }
            );
            return true;
        },

        /**
         * @method showMetadata
         *
         * Launches Ajax requests to embed metadata descriptions
         * for requested metadata
         *
         * Backend provides HTML setups that will be embedded and
         * styled with bundled CSS.
         *
         * @param {string} uuid uuid
         * @param {number} layerId layer id
         *
         */
        showMetadata: function (uuid, layerId) {
            if ((uuid === null || uuid === undefined) && (layerId === null || layerId === undefined)) {
                // Not a major error, keep on rolling
                this.instance.getSandbox().printError(
                    'showMetadata(): Missing layerId and uuid.'
                );
                return;
            }

            this._getMetadata(uuid, layerId);
        },

        /**
         * @method scheduleShowMetadata
         *
         * this 'schedules' asyncronous loading
         * ( calls directly now )
         * Used to buffer excess calls. Main entry point.
         *
         * @param {number} layerId layer id
         *
         */
        scheduleShowMetadata: function (uuid, layerId) {
            if ((uuid === null || uuid === undefined) && (layerId === null || layerId === undefined)) {
                // Not a major error, keep on rolling
                this.instance.getSandbox().printError(
                    'scheduleShowMetadata(): Missing uuid and layerId.'
                );
                return;
            }

            this.showMetadata(uuid, layerId);
        },

        /**
         * @private @method _linkify
         * FIXME use the original linkify if possible?
         * slightly modified  http://code.google.com/p/jquery-linkify/
         *
         * @param {string} inputText
         *
         */
        _linkify: function (inputText) {
            var replacePattern,
                replacedText;

            // URLs starting with http://, https://, or ftp://
            replacePattern =
                /(\b(https?|ftp):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gim;
            replacedText = inputText.replace(
                replacePattern,
                '<a href="$1" target="_blank">$1</a>'
            );

            // URLs starting with www.
            // (without // before it, or it'd re-link the ones done above)
            replacePattern = /(^|[^/])(www\.[\S]+(\b|$))/gim;
            replacedText = replacedText.replace(
                replacePattern,
                '$1<a href="http://$2" target="_blank">$2</a>'
            );

            // Change email addresses to mailto:: links
            // replacePattern = /(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6})/gim;
            // replacedText = replacedText.replace(
            //    replacePattern,
            //    '<a href="mailto:$1">$1</a>'
            // );

            return replacedText;
        },

        /**
         * @method showErrorMessage
         * Render 'metadata not found' message to ui
         */
        _showMetadataNotFoundMessage: function () {
            this.ui.text(this.locale.notFound);
        }

    }, {
        extend: ['Oskari.userinterface.component.Accordion']
    });
