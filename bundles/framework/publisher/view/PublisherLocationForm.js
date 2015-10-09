/**
 * @class Oskari.mapframework.bundle.publisher.view.PublisherLocationForm
 *
 * Represents the basic info (name, domain, language) view for the publisher
 * as an Oskari.userinterface.component.AccordionPanel
 */
Oskari.clazz.define('Oskari.mapframework.bundle.publisher.view.PublisherLocationForm',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Object} localization
     *       publisher localization data
     * @param {Oskari.mapframework.bundle.publisher.view.BasicPublisher} publisher
     *       publisher reference for language change
     */
    function (localization, publisher) {
        this.loc = localization;
        this._publisher = publisher;
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
                //'<label for="language">' + localization.language.label + '</label><br clear="all" />' +
                //'<select name="language"></select>' +
                '</div>')
        };
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
            me.fields.name.field.setContentCheck(true, me.loc.error.nameIllegalCharacters);

            if (pData) {
                // set initial values
                me.fields.domain.field.setValue(pData.domain);
                me.fields.name.field.setValue(pData.name);
                if (pData.lang) {
                    // if we get data as param -> use lang from it, otherwise use Oskari.getLang()
                    selectedLang = pData.lang;
                }
            }

            // Create language select
            var langField = Oskari.clazz.create('Oskari.userinterface.component.LanguageSelect'),
                langElement = me.langField.template.clone();

            langField.setValue(selectedLang);
            // plugins should change language when user changes selection
            langField.setHandler(function (value) {
                me._publisher.setPluginLanguage(value);
            });
            langElement.append(langField.getElement());
            me.langField.field = langField;
            me.langField.element = langElement;
        },

        /**
         * Returns the UI panel and populates it with the data that we want to show the user.
         *
         * @method getPanel
         * @return {Oskari.userinterface.component.AccordionPanel}
         */
        getPanel: function () {
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
            return panel;
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
            var values = {},
                fkey,
                data;

            for (fkey in this.fields) {
                if (this.fields.hasOwnProperty(fkey)) {
                    data = this.fields[fkey];
                    values[fkey] = data.field.getValue();
                }
            }
            values.language = this.langField.field.getValue();
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