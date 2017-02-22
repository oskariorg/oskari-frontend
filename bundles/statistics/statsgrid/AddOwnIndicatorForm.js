/**
 * @class Oskari.statistics.bundle.statsgrid.StatsToolbar
 */
Oskari.clazz.define(
    'Oskari.statistics.bundle.statsgrid.AddOwnIndicatorForm',
    /**
     * @static constructor function
     *
     * @param {Object}   sandbox
     * @param {Object}   localization
     * @param {String[]} regionCategories
     * @param {String}   layerWMSName
     * @param {String}   layerId
     * @param {String}   regionCategory
     *
     */
    function (sandbox, localization, regionCategories, layerWMSName, layerId, regionCategory) {
        var me = this;
        me.sandbox = sandbox;
        me.localization = localization;
        me.regions = regionCategories;
        me.layerWMSName = layerWMSName;
        me.layerId = layerId;
        me.regionCategory = regionCategory;
        me.municipalityCategory = 'kunta';
        me.templates = {
            main: '<form class="add-indicator">' +
                '    <h2></h2>' +
                '    <fieldset class="form-meta">' +
                '        <legend></legend>' +
                '        <label for="indicator_title"></label><input type="text" id="indicator_title" required>' +
                '        <label for="indicator_sources"></label><input type="text" id="indicator_sources" required>' +
                '        <label for="indicator_description"></label><input type="text" id="indicator_description" required>' +
                '        <label for="indicator_year"></label><input type="text" id="indicator_year" required>' +
                '        <label for="indicator_publicity"></label><input type="checkbox" id="indicator_publicity">' +
                '    </fieldset>' +
                '    <fieldset class="form-import">' +
                '        <legend></legend>' +
                '        <label for="indicator_reference-layer"></label><select id="indicator_reference-layer"></select>' +
                '        <label for="indicator_text-import"></label><textarea class="import-textarea" id="indicator_text-import"></textarea>' +
                '        <button class="start-import primary" title=""></button><button class="clear-import" title=""></button>' + // We need the empty title so the tooltip will show up...
                '    </fieldset>' +
                '    <fieldset class="form-municipalities">' +
                '        <legend></legend><hr>' +
                '        <ul class="municipalities"></ul>' +
                '    </fieldset>' +
                '    <fieldset class="form-submit">' +
                '        <button class="cancel-form-button"></button><button class="submit-form-button primary" title=""></button><button class="clear-form-button"></button>' +
                '    </fieldset>' +
                '</form>',
            municipalityRow:
                '<li class="municipality-row">' +
                '    <label class="municipality-row"></label><input type="text">' +
                '</li>'
        };
    }, {
        /**
         * @public @method _createUI
         * Create UI for the form
         *
         * @param {jQuery}   container
         * @param {Function} callback
         *
         */
        createUI: function (container, callback) {
            var me = this,
                form = jQuery(me.templates.main);

            me.container = container;

            // Set main title
            form.find('h2').append(me.localization.addDataTitle);

            // Set title for indicator metadata fieldset
            form.find('fieldset.form-meta > legend')
                .append(me.localization.baseInfoTitle);

            // Set label, placeholders etc. for indicator metadata fields
            var field = form.find('#indicator_title');
            field.prev().append(me.localization.addDataMetaTitle);
            field.attr('placeholder', me.localization.addDataMetaTitlePH);

            field = form.find('#indicator_sources');
            field.prev().append(me.localization.addDataMetaSources);
            field.attr('placeholder', me.localization.addDataMetaSourcesPH);

            field = form.find('#indicator_description');
            field.prev().append(me.localization.addDataMetaDescription);
            field.attr('placeholder', me.localization.addDataMetaDescriptionPH);

            field = form.find('#indicator_year');
            field.prev().append(me.localization.addDataMetaYear);
            field.attr('placeholder', me.localization.addDataMetaYear);
            field.blur(function (e) {
                me.validateYear(this.value, e);
            });
            field.keypress(function (e) {
                me.validateYear(this.value, e);
            });

            form.find('#indicator_publicity').prev().append(
                me.localization.addDataMetaPublicity
            );

            // Set title for indicator data fieldset
            form.find('fieldset.form-import > legend')
                .append(me.localization.addDataTitle);

            field = form.find('#indicator_reference-layer');
            field.prev().append(me.localization.addDataMetaReferenceLayer);

            // Add region categories
            var regionCategories = [
                'KUNTA',
                'ALUEHALLINTOVIRASTO',
                'MAAKUNTA',
                'NUTS1',
                'SAIRAANHOITOPIIRI',
                'SEUTUKUNTA',
                'ERVA',
                'ELY-KESKUS'
            ];

            _.each(regionCategories, function (region) {
                var regionOption = jQuery('<option></option>');
                regionOption.val(region).html(me.localization.regionCategories[region]);

                if (me.regionCategory === region) {
                    regionOption.attr('selected', 'selected');
                }

                field.append(regionOption);
            });
            field.change(function (e) {
                me.regionCategory = e.target.value;
                me._createRegionInputs(form, me.regions[e.target.value]);
            });

            // Set labels, placeholders etc. for indicator data fields
            form.find('fieldset.form-import textarea')
                .attr('placeholder', me.localization.importDataDescription)
                .prev().html(me.localization.dataRows);
            field = form.find('button.clear-import');
            field.append(me.localization.clearImportDataButton);
            field.click(function (e) {
                e.preventDefault();
                form.find('fieldset.form-import textarea').val('');
            });

            field = form.find('button.start-import');
            field.append(me.localization.importDataButton);
            field.click(function (e) {
                e.preventDefault();
                me._parseData(e, me, form.find('fieldset.form-import'));
            });

            // Add clear, cancel and submit button functionality
            field = form.find('.cancel-form-button');
            field.append(me.localization.formCancel);
            field.click(function (e) {
                e.preventDefault();
                me._handleCancel(e, me);
            });

            field = form.find('.clear-form-button');
            field.append(me.localization.formEmpty);
            field.click(function (e) {
                e.preventDefault();
                me._clearValues();
            });

            // add data submit
            field = form.find('.submit-form-button');
            field.append(me.localization.formSubmit);
            field.click(function (e) {
                e.preventDefault();
                me._handleSubmit(e, me, callback);
            });

            me._createRegionInputs(form, me.regions[me.regionCategory]);

            container.append(form);
        },

        /**
         * @private @method _createRegionInputs
         *
         * @param {jQuery}   container
         * @param {Object[]} regions
         *
         */
        _createRegionInputs: function (container, regions) {
            var me = this,
                header = container.find('.form-municipalities legend'),
                tbl = container.find('.municipalities'),
                row,
                name;

            header.html(me.localization.regionCategories[me.regionCategory]);
            tbl.empty();

            _.each(regions, function (region) {
                row = jQuery(me.templates.municipalityRow).clone();
                name = region.municipality.toLowerCase();

                if (me.regionCategory.toLowerCase() === me.municipalityCategory) {
                    name = name.split(' ')[0];
                }

                row
                    .attr('data-name', name)
                    .attr('data-code', region.code)
                    .attr('data-id', region.id)
                    .find('label')
                    .attr('for', 'municipality_' + name)
                    .append(region.municipality + ' (' + region.code + ')');

                row
                    .find('input')
                    .attr('id', 'municipality_' + name)
                    .attr('placeholder', me.localization.municipalityPlaceHolder);

                tbl.append(row);
            });
        },

        /**
         * @private @method _handleCancel
         * Remove form and show grid
         *
         * @param {} e
         * @param {} me
         *
         */
        _handleCancel: function (e, me) {
            me.container.find('form.add-indicator').remove();
            me.container.find('.selectors-container').show();
            me.container.find('.data-source-select').show();
            me.container.find('#municipalGrid').show();
        },

        /**
         * @private @method _handleSubmit
         * Send data to backend and remove form.
         *
         * @param {} e
         * @param {} me
         * @param {Function} callback
         *
         */
        _handleSubmit: function (e, me, callback) {
            var service = this.sandbox.getService(
                    'Oskari.statistics.bundle.statsgrid.UserIndicatorsService'
                ),
                indicatorData = me._gatherData();

            if (indicatorData  && service) {
                if (this.sandbox && Oskari.user().isLoggedIn()) {
                    service.saveUserIndicator(indicatorData, function (indicator) {
                        me._handleCancel(e, me);
                        if (indicator.id !== null && indicator.id !== undefined) {
                            indicatorData.indicatorId = 'user_' + indicator.id;
                            callback(indicatorData);
                        }
                    }, function () {
                    });
                } else {
                    me._handleCancel(e, me);
                    indicatorData.indicatorId = 'user_' + new Date().getTime();
                    callback(indicatorData);
                }
            }
        },

        /**
         * @private @method _parseData
         * Parse data from dialog (it is pasted from clipboard)
         *
         * @param {} e
         * @param {} me
         * @param {} dialog
         *
         */
        _parseData: function (e, me, dialog) {
            var inputArray = [],
                form = jQuery(e.target).parents('form.add-indicator'),
                textarea = form.find('textarea'),
                data = textarea.val();

            //update form regions / municipalities
            var updateValue = function (name, value) {
                var row;
                //if code instead of name...
                if (/^\d+$/.test(name)) {
                    // add prefix zeros to the code if needed (in case of municipality)
                    if (me.regionCategory.toLowerCase() === me.municipalityCategory) {
                        if (name.length === 1) {
                            name = '00' + name;
                        }
                        if (name.length === 2) {
                            name = '0' + name;
                        }
                    }
                    row = me.container.find(
                        '.municipality-row[data-code="' + name + '"]'
                    );
                } else {
                    // Only use the first part of the name in case of a municipality
                    if (me.regionCategory.toLowerCase() === me.municipalityCategory) {
                        name = name.split(' ')[0];
                    }
                    row = me.container.find(
                        '.municipality-row[data-name="' + name.toLowerCase() + '"]'
                    );
                }

                if (row && row.length) {
                    row.find('input').val(value);
                    // Why would we want to move the row?
                    row.appendTo(row.parent());
                    return true;
                }

                return false;
            };
            var lines = data.match(/[^\r\n]+/g),
                updated = 0,
                unrecognized = [];
            //loop through all the lines and parse municipalities (name or code)
            _.each(lines, function (line) {
                var area,
                    value;

                //separator can be tabulator, comma or colon
                var matches = line.match(/([^\t:,]+) *[\t:,]+ *(.*)/);
                //var matches = line.match(/(.*) *[\t:,]+ *(.*)/);
                if (matches && matches.length === 3) {
                    area = matches[1];
                    value = (matches[2] || '').replace(',', '.').replace(/\s/g, '');
                }
                // update municipality values
                if (updateValue(jQuery.trim(area), jQuery.trim(value))) {
                    updated += 1;
                } else if (value && value.length > 0) {
                    unrecognized.push({
                        region: area,
                        value: value
                    });
                }
            });
            // Attach tooltip to clea-import as it's on the right...
            var openImport = me.container.find('.clear-import');
            // alert user of unrecognized lines
            var unrecognizedInfo = '';

            if (unrecognized.length > 0) {
                unrecognizedInfo = '<br>' + me.localization.parsedDataUnrecognized + ': ' + unrecognized.length;
            }
            // Tell user about how many regions were imported
            var info = me.localization.parsedDataInfo +
                ': <span class="import-indicator-bold">' + updated +
                '</span> ' + unrecognizedInfo;

            openImport.tooltip({
                content: info,
                position: {
                    my: 'right-10 center',
                    at: 'left center'
                }
            });
            openImport.tooltip('open');

            textarea.val('');
        },

        /**
         * @private @method _parseData
         * Parse data from dialog (it is pasted from clipboard)
         *
         *
         * @return {Object} Dialog data
         */
        _gatherData: function () {
            var me = this,
                json = {},
                emptyFields = [],
                tmp;

            // Get indicator title or push it to the unrecognized areas array
            var title = me.container.find('#indicator_title').val();
            if (title === null || title === undefined || title.trim() === '') {
                emptyFields.push(me.container.find('#indicator_title').prev().text());
            }
            // TODO: real localized title
            tmp = {};
            tmp[Oskari.getLang()] = title;
            json.title = JSON.stringify(tmp);

            var source = me.container.find('#indicator_sources').val();
            if (source === null || source === undefined || source.trim() === '') {
                emptyFields.push(me.container.find('#indicator_sources').prev().text());
            }
            // TODO: real localized source
            tmp = {};
            tmp[Oskari.getLang()] = source;
            json.source = JSON.stringify(tmp);

            var description = me.container.find('#indicator_description').val();
            if (description === null || description === undefined || description.trim() === '') {
                emptyFields.push(me.container.find('#indicator_description').prev().text());
            }
            // TODO: real localized description
            tmp = {};
            tmp[Oskari.getLang()] = description;
            json.description = JSON.stringify(tmp);

            var year = me.container.find('#indicator_year').val(),
                text = /^[0-9]+$/,
                currentYear = new Date().getFullYear();

            if (year === null || year === undefined || year.trim() === '' ||
                ((year !== '') && (!text.test(year))) ||
                year.length !== 4 ||
                year < 1900 ||
                year > currentYear) {

                emptyFields.push(me.container.find('#indicator_year').prev().text());
            }
            json.year = year;

            json.material = me.layerId; //reference layer

            json.published = me.container.find('#indicator_publicity').prop('checked');

            json.category = me.regionCategory;

            json.data = [];

            // if there was empty fields
            if (emptyFields.length > 0) {
                var submitBtn = me.container.find('.submit-form-button'),
                    failedSubmit = me.localization.failedSubmit + '<br>' + emptyFields.join(', ');
                submitBtn.attr('title', failedSubmit);
                submitBtn.tooltip({
                    content: failedSubmit,
                    position: {
                        my: 'right bottom-10',
                        at: 'right top'
                    }
                });
                submitBtn.tooltip('open');
                setTimeout(function () {
                    submitBtn.tooltip('destroy');
                    submitBtn.attr('title', '');
                }, 1500);
                return null;
            } else {
                // loop through all the regions and gather data
                var municipalityRows = me.container.find('.municipality-row'),
                    i;

                for (i = 0; i < municipalityRows.length; i += 1) {
                    var row = jQuery(municipalityRows[i]),
                        input = row.find('input'),
                        value = input.val();

                    if (value !== null && value !== undefined && value.trim() !== '') {
                        json.data.push({
                            'region': row.attr('data-id'),
                            'primary value': value
                        });
                    }
                }
                json.data = JSON.stringify(json.data);
                return json;
            }
        },

        /**
         * @private @method _clearValues
         *
         *
         */
        _clearValues: function () {
            this.container.find('input[type=text]').val('');
            this.container.find('#indicator_publicity').prop('checked', false);
            // FIXME reset region category
        },

        /**
         * @public @method validateYear
         * Validate year (keypress & blur)
         *
         * @param {String} year
         * @param {} e
         *
         * @return {Boolean} Year validity
         */
        validateYear: function (year, e) {

            var text = /^[0-9]+$/;
            var isYear = (year.length === 4 && year !== 0 && year !== '0') ? true : false;
            if (e.type === 'blur' ||  isYear & e.keyCode !== 8 && e.keyCode !== 46 && e.keyCode !== 37 && e.keyCode !== 39) {
                    var current = jQuery(e.target);

                    if ((year !== '') && (!text.test(year))) {
                        current.css({
                            'color': '#ff0000'
                        });
                        return false;
                    }
                    if (year.length !== 4) {
                        current.css({
                            'color': '#ff0000'
                        });
                        return false;
                    }
                    // is from the 1800s or extends to the future
                    var currentYear = new Date().getFullYear();

                    if ((year < 1900) || (year > currentYear)) {
                        //alert("Year should be in range 1920 to current year");
                        current.css({
                            'color': '#ff0000'
                        });
                        return false;
                    }
                    current.css({
                        'color': '#878787'
                    });
                    return true;
            }
        }
    }
);
