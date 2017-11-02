/**
 * @class Oskari.mapframework.bundle.publisher2.view.PanelGeneralInfo
 *
 * Represents the basic info (name, domain, language) view for the publisher
 * as an Oskari.userinterface.component.AccordionPanel
 */
Oskari.clazz.define('Oskari.mapframework.bundle.publisher2.view.PanelGeneralInfo',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Object} sandbox
     * @param {Object} localization
     *       publisher localization data
     */
    function (sandbox, localization) {
        this.loc = localization;
        this.sandbox = sandbox;
        this.fields = {
            domain: {
                label: localization.domain.label,
                placeholder: localization.domain.placeholder,
                helptags: 'portti,help,publisher,domain',
                tooltip: localization.domain.tooltip
            },
            name: {
                label: localization.name.label,
                placeholder: localization.name.placeholder,
                helptags: 'portti,help,publisher,name',
                tooltip: localization.name.tooltip
            }
        };
        this.langField = {
            template: jQuery('<div class="field">' +
                '<div class="help icon-info" title="' + localization.language.tooltip + '" helptags="portti,help,publisher,language"></div>' +
                '</div>')
        };
        this.panel = null;
    }, {
        /**
         * Creates the set of Oskari.userinterface.component.FormInput to be shown on the panel and
         * sets up validation etc. Prepopulates the form fields if pData parameter is given.
         *
         * @method init
         * @param {Object} pData initial data
         */
        init: function (pData) {
            var me = this,
                fkey,
                data,
                field,
                selectedLang = Oskari.getLang();

            for (fkey in me.fields) {
                if (me.fields.hasOwnProperty(fkey)) {
                    data = me.fields[fkey];
                    field = Oskari.clazz.create('Oskari.userinterface.component.FormInput', fkey);
                    field.getField().find('input').before('<br />');
                    field.setLabel(data.label);
                    field.setTooltip(data.tooltip, data.helptags);
                    field.setPlaceholder(data.placeholder);
                    data.field = field;
                }
            }

            me.fields.domain.field.setRequired(true, me.loc.error.domain);
            me.fields.domain.field.setContentCheck(true, me.loc.error.domainIllegalCharacters);

            me.fields.domain.field.setValidator(function (inputField) {
                var value = inputField.getValue(),
                    name = inputField.getName(),
                    errors = [];
                if (value.indexOf('http') === 0 || value.indexOf('www') === 0) {
                    errors.push({
                        field: name,
                        error: me.loc.error.domainStart
                    });
                    return errors;
                }
                return errors;
            });
            me.fields.name.field.setRequired(true, me.loc.error.name);
            me.fields.name.field.setValidator(function (inputField) {
                var value = inputField.getValue(),
                    name = inputField.getName(),
                    sanitizedValue,
                    errors = [];
                inputField.setValue(value);
                sanitizedValue = Oskari.util.sanitize(value);
                if (sanitizedValue !== value) {
                    errors.push({
                        field: name,
                        error: me.loc.error.nameIllegalCharacters
                    });
                    return errors;
                }
                return errors;
            });

            if (pData.metadata) {
                // set initial values
                me.fields.domain.field.setValue(pData.metadata.domain);
                me.fields.name.field.setValue(pData.metadata.name);
                if (pData.metadata.language) {
                    // if we get data as param -> use lang from it, otherwise use Oskari.getLang()
                    selectedLang = pData.metadata.language;
                }
            }

            // Create language select
            var langField = Oskari.clazz.create('Oskari.userinterface.component.LanguageSelect'),
                langElement = me.langField.template.clone();

            langField.setValue(selectedLang);
            // plugins should change language when user changes selection
            langField.setHandler(function (value) {
                me._languageChanged(value);
            });
            langElement.append(langField.getElement());
            langElement.append('<div class="info-label"></div>');
            me.langField.field = langField;
            me.langField.element = langElement;

            me._languageChanged(selectedLang);
        },

        /**
         * Returns the UI panel and populates it with the data that we want to show the user.
         *
         * @method getPanel
         * @return {Oskari.userinterface.component.AccordionPanel}
         */
        getPanel: function () {
            if(this.panel) {
                return this.panel;
            }
            var panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel'),
                contentPanel = panel.getContainer(),
                fkey,
                data;

            panel.setTitle(this.loc.domain.title);
            for (fkey in this.fields) {
                if (this.fields.hasOwnProperty(fkey)) {
                    data = this.fields[fkey];
                    contentPanel.append(data.field.getField());
                }
            }
            contentPanel.append(this.langField.element);
            this.panel = panel;
            return panel;
        },
        /**
         * Show notification if selected language is different from the oskari's main language selection
         * @param {String} value
         */
        _languageChanged: function(value) {
            var me = this,
                message = (value !== Oskari.getLang() ? me.loc.language.languageChangedDisclaimer:"");
            jQuery(me.langField.element).find('div.info-label').html(message);

        },
        /**
         * Returns the selections the user has done with the form inputs.
         * {
         *     domain : <domain field value>,
         *     name : <name field value>,
         *     language : <language user selected>
         * }
         *
         * @method getValues
         * @return {Object}
         */
        getValues: function () {
            var values = {
                    metadata: {}
                },
                fkey,
                data;

            for (fkey in this.fields) {
                if (this.fields.hasOwnProperty(fkey)) {
                    data = this.fields[fkey];
                    values.metadata[fkey] = data.field.getValue();
                }
            }
            values.metadata.language = this.langField.field.getValue();
            return values;
        },

        /**
         * Returns any errors found in validation or an empty
         * array if valid. Error object format is defined in Oskari.userinterface.component.FormInput
         * validate() function.
         *
         * @method validate
         * @return {Object[]}
         */
        validate: function () {
            var errors = [],
                fkey,
                data;

            for (fkey in this.fields) {
                if (this.fields.hasOwnProperty(fkey)) {
                    data = this.fields[fkey];
                    errors = errors.concat(data.field.validate());
                }
            }
            return errors;
        }
    });