import React from 'react';
import ReactDOM from 'react-dom';
import { GeneralInfoForm } from './form/GeneralInfoForm';

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
            name: {
                label: localization.name.label,
                placeholder: localization.name.placeholder,
                helptags: 'portti,help,publisher,name',
                tooltip: localization.name.tooltip,
                value: null
            },
            domain: {
                label: localization.domain.label,
                placeholder: localization.domain.placeholder,
                helptags: 'portti,help,publisher,domain',
                tooltip: localization.domain.tooltip,
                value: null
            },
            language: {
                value: null
            }
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
            const me = this;
            let selectedLang = Oskari.getLang();

            me.fields.name.validator = function (value) {
                const name = 'name';
                const errors = [];
                const sanitizedValue = Oskari.util.sanitize(value);
                if (!value || !value.trim().length) {
                    errors.push({
                        field: name,
                        error: me.loc.error.name
                    });
                    return errors;
                }
                if (sanitizedValue !== value) {
                    errors.push({
                        field: name,
                        error: me.loc.error.nameIllegalCharacters
                    });
                    return errors;
                }
                return errors;
            };

            me.fields.domain.validator = function (value) {
                const name = 'domain';
                const errors = [];
                if (value && value.indexOf('://') !== -1) {
                    errors.push({
                        field: name,
                        error: me.loc.error.domainStart
                    });
                    return errors;
                }
                return errors;
            };

            if (pData.metadata) {
                // set initial values
                me.fields.domain.value = pData.metadata.domain;
                me.fields.name.value = pData.metadata.name;
                if (pData.metadata.language) {
                    // if we get data as param -> use lang from it, otherwise use Oskari.getLang()
                    selectedLang = pData.metadata.language;
                }
                me.fields.language.value = selectedLang;
            }
        },
        onChange: function (key, value) {
            this.fields[key].value = value;
        },
        /**
         * Returns the UI panel and populates it with the data that we want to show the user.
         *
         * @method getPanel
         * @return {Oskari.userinterface.component.AccordionPanel}
         */
        getPanel: function () {
            if (this.panel) {
                return this.panel;
            }
            var panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel'),
                contentPanel = panel.getContainer();

            ReactDOM.render(
                <GeneralInfoForm onChange={(key, value) => this.onChange(key, value)} data={this.fields} />,
                contentPanel[0]
            );

            panel.setTitle(this.loc.domain.title);
            this.panel = panel;
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
            var values = {
                    metadata: {}
                },
                fkey,
                data;

            for (fkey in this.fields) {
                if (this.fields.hasOwnProperty(fkey)) {
                    data = this.fields[fkey];
                    values.metadata[fkey] = data.value;
                }
            }
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
                    if (data.validator) {
                        errors = errors.concat(data.validator(data.value));
                    }
                }
            }
            return errors;
        }
    });
