/**
 * @class Oskari.statistics.bundle.statsgrid.StatsToolbar
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.AddOwnIndicatorForm',
    /**
     * @static constructor function
     * @param {Object} localization
     * @param {Oskari.statistics.bundle.statsgrid.StatsGridBundleInstance} instance
     */
    function (sandbox, localization, regionCategories, layerWMSName, layerId, regionCategory) {
        this.sandbox = sandbox;
        this.localization = localization;
        this.regions = regionCategories;
        this.layerWMSName = layerWMSName;
        this.layerId = layerId;
        this.regionCategory = regionCategory;
        this.municipalityCategory = 'kunta';

        this.templates = {
            "main": '<form class="add-indicator">' +
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
            "municipalityRow": '<li class="municipality-row"><label class="municipality-row"></label><input type="text"></li>'
        };
    }, {
        /**
         * @method _createUI
         * Create UI for the form
         */
        createUI: function (container, callback) {
            var me = this,
                form = jQuery(me.templates.main),
                layer = me.sandbox.findMapLayerFromAllAvailable(me.layerId);

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
            form.find('#indicator_publicity').prev().append(me.localization.addDataMetaPublicity);

            // Set title for indicator data fieldset
            form.find('fieldset.form-import > legend')
                .append(me.localization.addDataTitle);

            field = form.find('#indicator_reference-layer');
            field.prev().append(me.localization.addDataMetaReferenceLayer);

            // Add region categories
            var regionCategories = layer.getCategoryMappings().categories;

            _.each(regionCategories, function (region) {
                var regionOption = jQuery('<option></option>');
                regionOption.
                val(region).
                html(me.localization.regionCategories[region]);

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
                me._handleCancel(e, me);
            });
            field = form.find('.clear-form-button');
            field.append(me.localization.formEmpty);
            field.click(function (e) {
                me._clearValues();
            });
            // add data submit
            field = form.find('.submit-form-button');
            field.append(me.localization.formSubmit);
            field.click(function (e) {
                me._handleSubmit(e, me, callback);
            });

            me._createRegionInputs(form, me.regions[me.regionCategory]);

            container.append(form);

        },

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
                    .append(region.municipality + " (" + region.code + ")");

                row
                    .find('input')
                    .attr('id', 'municipality_' + name)
                    .attr('placeholder', me.localization.municipalityPlaceHolder);

                tbl.append(row);
            });
        },
        /**
         * @method _handleCancel
         * @private
         * Remove form and show grid
         */
        _handleCancel: function (e, me) {
            me.container.find('form.add-indicator').remove();
            me.container.find('.selectors-container').show();
            me.container.find('#municipalGrid').show();
        },
        /**
         * @method _handleSubmit
         * @private
         * Send data to backend and remove form.
         */
        _handleSubmit: function (e, me, callback) {
            var service = this.sandbox.getService('Oskari.statistics.bundle.statsgrid.UserIndicatorsService'),
                indicatorData = me._gatherData();

            if (indicatorData !== null && indicatorData !== undefined && service !== null && service !== undefined) {
                if (this.sandbox && this.sandbox.getUser().isLoggedIn()) {
                    service.saveUserIndicator(indicatorData, function (indicator) {
                        me._handleCancel(e, me);
                        if (indicator.id !== null && indicator.id !== undefined) {
                            indicatorData.indicatorId = 'user_' + indicator.id;
                            callback(indicatorData);
                        }
                    }, function (jqXHR, textStatus) {
                        //TODO some better way of showing errors? Popup?
                        alert(me.localization.connectionProblem);
                    });
                } else {
                    me._handleCancel(e, me);
                    indicatorData.indicatorId = 'user_' + new Date().getTime();
                    callback(indicatorData);
                }
            }
        },

        /**
         * @method _parseData
         * @private
         * Parse data from dialog (it is pasted from clipboard)
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
                    row = me.container.find('.municipality-row[data-code=' + name + ']');
                } else {
                    // Only use the first part of the name in case of a municipality
                    if (me.regionCategory.toLowerCase() === me.municipalityCategory) {
                        name = name.split(' ')[0];
                    }
                    row = me.container.find('.municipality-row[data-name=' + name.toLowerCase() + ']');
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
                updated = 0;
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
                    value = (matches[2] || '').replace(',', '.');
                }
                // update municipality values
                if (updateValue(jQuery.trim(area), jQuery.trim(value))) {
                    updated++;
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
            var unrecognizedInfo = "";
            if (unrecognized.length > 0) {
                unrecognizedInfo = '<br>' + me.localization.parsedDataUnrecognized + ': ' + unrecognized.length;
            }
            // Tell user about how many regions were imported
            var info = me.localization.parsedDataInfo + ': <span class="import-indicator-bold">' + updated + '</span> ' + unrecognizedInfo;
            openImport.tooltip({
                content: info,
                position: {
                    my: "right-10 center",
                    at: "left center"
                }
            });
            openImport.tooltip("open");

            textarea.val('');
        },
        /**
         * @method _parseData
         * @private
         * Parse data from dialog (it is pasted from clipboard)
         */
        _gatherData: function () {
            // FIXME all jQuery selectors...
            var me = this,
                json = {},
                emptyFields = [];

            // IE8 fix
            if (typeof String.prototype.trim !== 'function') {
                String.prototype.trim = function () {
                    return this.replace(/^\s+|\s+$/g, '');
                };
            }
            // Get indicator title or push it to the unrecognized areas array
            var title = me.container.find('#indicator_title').val();
            if (title === null || title === undefined || title.trim() === "") {
                emptyFields.push(me.container.find('#indicator_title').prev().text());
            }
            // TODO: real localized title
            json.title = JSON.stringify({
                'fi': title
            });

            var source = me.container.find('#indicator_sources').val();
            if (source === null || source === undefined || source.trim() === "") {
                emptyFields.push(me.container.find('#indicator_sources').prev().text());
            }
            // TODO: real localized source
            json.source = JSON.stringify({
                'fi': source
            });

            var description = me.container.find('#indicator_description').val();
            if (description === null || description === undefined || description.trim() === "") {
                emptyFields.push(me.container.find('#indicator_description').prev().text());
            }
            // TODO: real localized description
            json.description = JSON.stringify({
                'fi': description
            });

            var year = me.container.find('#indicator_year').val(),
                text = /^[0-9]+$/,
                currentYear = new Date().getFullYear();
            if (year === null || year === undefined || year.trim() === "" ||
                ((year !== "") && (!text.test(year))) ||
                year.length != 4 ||
                year < 1900 ||
                year > currentYear) {

                emptyFields.push( me.container.find('#indicator_year').prev().text());
            }
            json.year = year;

            json.material = me.layerId; //reference layer

            json.published = me.container.find('#indicator_publicity').prop('checked');

            json.category = me.regionCategory;
            //json.category = me.container.find('.form-meta .reference-layer select').val();

            json.data = [];

            // if there was empty fields 
            if (emptyFields.length > 0) {
                var submitBtn = me.container.find('.submit-form-button');
                var failedSubmit = me.localization.failedSubmit + '<br>' + emptyFields.join(", ");
                submitBtn.attr('title', failedSubmit);
                submitBtn.tooltip({
                    content: failedSubmit,
                    position: {
                        my: "right bottom-10",
                        at: "right top"
                    }
                });
                submitBtn.tooltip("open");
                setTimeout(function () {
                    submitBtn.tooltip("destroy");
                    submitBtn.attr('title', '');
                }, 1500);
                return null;
            } else {
                // loop through all the regions and gather data 
                var municipalityRows = me.container.find('.municipality-row'),
                    i;
                for (i = 0; i < municipalityRows.length; i++) {
                    var row = jQuery(municipalityRows[i]),
                        input = row.find('input'),
                        value = input.val();
                    if (value !== null && value !== undefined && value.trim() !== "") {
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

        _clearValues: function () {
            this.container.find('input[type=text]').val('');
            this.container.find('#indicator_publicity').prop('checked', false);
            // FIXME reset region category
        },

        /**
         * @method validateYear
         * Validate year (keypress & blur)
         */
        validateYear: function (year, e) {
            // FIXME just parseInt(value, 10); !isNaN(numVal) && numVal >= minVal && numVal <= maxVal
            var text = /^[0-9]+$/;
            if (e.type == "blur" ||
                year.length === 4 && e.keyCode !== 8 && e.keyCode !== 46 && e.keyCode !== 37 && e.keyCode !== 39) {
                if (year !== 0 && year !== '0') {
                    var current = jQuery(e.target);
                    if ((year !== "") && (!text.test(year))) {
                        //alert("Please Enter Numeric Values Only");
                        current.css({
                            'color': '#ff0000'
                        });
                        return false;
                    }
                    if (year.length != 4) {
                        //alert("Year is not proper. Please check");
                        current.css({
                            'color': '#ff0000'
                        });
                        return false;
                    }
                    // FIXME I think it's completely feasible to have data that
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
    });
