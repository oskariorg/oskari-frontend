/**
 * @class Oskari.statistics.bundle.statsgrid.StatsToolbar
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.AddOwnIndicatorForm', 
/**
 * @static constructor function
 * @param {Object} localization
 * @param {Oskari.statistics.bundle.statsgrid.StatsGridBundleInstance} instance
 */
function(sandbox, localization, regionCategories, layerWMSName, layerId, regionCategory) {
    this.sandbox = sandbox;
    this.localization = localization;
    this.regions = regionCategories;
    this.layerWMSName = layerWMSName;
    this.layerId = layerId;
    this.regionCategory = regionCategory;
    this.municipalityCategory = 'kunta';

    this.template = {
        'formCont' : '<div class="form-cont"></div>',
        'formHead' : '<div class="form-head"><h2></h2></div>',
        'formShowImport' : '<div class="form-show-import"><button class="import-button"></button></div>',
        'formImport' : '<div class="form-import"><textarea class="import-textarea"></textarea><button class="start-import"></button></div>',
        'formMeta' : '<div class="form-meta"><div class="title"><label></label><input type="text" required></div><div class="sources"><label></label><input type="text" required></div><div class="description"><label></label><input type="text" required></div><div class="year"><label></label><input type="text" required></div><div class="reference-layer"><label></label><select></select></div><div class="publicity"><label></label><input type="checkbox"></div></div>',
        'formMunicipalities': '<div class="municipalities"></div>',
        'formMunicipalityHeader': '<div class="municipality-header"><label></label><hr></div>',
        'formMunicipalityRow': '<div class="municipality-row"><label></label><input type="text"></div>',
        'formSubmit':'<div class="form-submit"><button class="submit-form-button" title=""></button><button class="cancel-form-button"></button></div>',
        'importDataPopup' : '<div class="import-data-popup"><p class="import-data-desc"></p><div class="import-container"><textarea class="import-data-textarea"></textarea></div></div>'
    };
}, {
	/**
	 * @method _createUI
	 * Create UI for the form
	 */
	createUI : function(container, callback) {
        var me = this,
            layer = me.sandbox.findMapLayerFromAllAvailable(me.layerId),
            formCont = jQuery(me.template.formCont).clone(),
            formHead = jQuery(me.template.formHead).clone(),
            formShowImport = jQuery(me.template.formShowImport).clone(),
            formMeta = jQuery(me.template.formMeta).clone(),
            formMunicipalityHeader = jQuery(me.template.formMunicipalityHeader).clone(),
            formMunicipalities = jQuery(me.template.formMunicipalities).clone(),
            formSubmit = jQuery(me.template.formSubmit).clone();

        me.container = container;
        // add localizations
        var title = formMeta.find('.title');
        title.find('label').append(this.localization.addDataMetaTitle);
        title.find('input').attr('placeholder', this.localization.addDataMetaTitlePH);
        var sources = formMeta.find('.sources');
        sources.find('label').append(this.localization.addDataMetaSources);
        sources.find('input').attr('placeholder', this.localization.addDataMetaSourcesPH);
        var description = formMeta.find('.description');
        description.find('label').append(this.localization.addDataMetaDescription);
        description.find('input').attr('placeholder', this.localization.addDataMetaDescription);
        var year = formMeta.find('.year');
        year.find('label').append(this.localization.addDataMetaYear);
        year.find('input')
            .attr('placeholder', this.localization.addDataMetaYear)
            .blur(function(e) {
                me.validateYear(this.value, e);
            })
            .keypress(function(e) {
                me.validateYear(this.value, e);
            });

        formMeta.find('.reference-layer').find('label').append(this.localization.addDataMetaReferenceLayer);
        //formMeta.find('.reference-layer').find('span').append(me.layerWMSName);
        var regionCategorySelect = formMeta.find('.reference-layer').find('select');
        var regionCategories = layer.getCategoryMappings().categories;

        _.each(regionCategories, function(region) {
            var regionOption = jQuery('<option></option>');
            regionOption.
                val(region).
                html(me.localization.regionCategories[region]);

            if (me.regionCategory === region) regionOption.attr('selected', 'selected');

            regionCategorySelect.append(regionOption);
        });
        regionCategorySelect.change(function(e) {
            me.regionCategory = e.target.value;
            me._createRegionInputs(formCont, me.regions[e.target.value]);
        });

        formMeta.find('.publicity').find('label').append(this.localization.addDataMetaPublicity);

        formHead.find('h2').append(me.localization.addDataTitle);

        // add import button (popup)
        var importButton = formShowImport.find('.import-button');
        importButton.append(me.localization.openImportDataButton);
        importButton.attr('title', me.localization.openImportDialogTip);
        importButton.click(function(e) {
            var popup = jQuery(me.template.importDataPopup);
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');

            // cancel
            var cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            cancelBtn.setTitle(me.localization.cancelButton);
            cancelBtn.setHandler(function() {
                dialog.close(true);
                me.container.find('.import-button')
                    .tooltip({ 
                        content: me.localization.openImportDialogTip, 
                        position: { my: "right-10 center", at: "left center" } 
                    });
            });

            // add
            var addBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            addBtn.setTitle(me.localization.importDataButton);
            addBtn.addClass('primary');
            addBtn.setHandler(function(e) {
                me._parseData(e, me, dialog);
            });

            popup.find('.import-data-desc')
                .append(me.localization.importDataDescription);

            // show the dialog
            dialog.show(me.localization.popupTitle, popup, [cancelBtn, addBtn]);
            // keydown -> don't move the map
            popup.on('keydown', function(e) {
                e.stopPropagation();
            });

        });

        // add cancel data submit
        var cancel = formSubmit.find('.cancel-form-button');
        cancel.append(me.localization.formCancel);
        cancel.click(function(e) {
            me._handleCancel(e, me);
        });
        // add data submit
        var submit = formSubmit.find('.submit-form-button');
        submit.append(me.localization.formSubmit);
        submit.click(function(e) {
            me._handleSubmit(e, me, callback);
        });

        formCont
            .append(formHead)
            .append(formMeta)
            .append(formShowImport)
            .append(formMunicipalityHeader)
            .append(formMunicipalities)
            .append(formSubmit);

        me._createRegionInputs(formCont, me.regions[me.regionCategory]);

        container.append(formCont);

	},
    _createRegionInputs: function(container, regions) {
        var me = this,
            header = container.find('div.municipality-header label'),
            form = container.find('div.municipalities'),
            row, name;

        header.html(me.localization.regionCategories[me.regionCategory]);
        form.empty();

        _.each(regions, function(region) {
            row = jQuery(me.template.formMunicipalityRow).clone();
            name = region.municipality.toLowerCase();

            if (me.regionCategory.toLowerCase() === me.municipalityCategory) {
                name = name.split(' ')[0];
            }

            row
                .attr('data-name', name)
                .attr('data-code', region.code)
                .attr('data-id', region.id)                
                .find('label')
                .attr('for', 'municipality_'+ name)
                .append(region.municipality + " (" + region.code + ")");

            row
                .find('input')
                .attr('id', 'municipality_'+ name)
                .attr('placeholder', me.localization.municipalityPlaceHolder);

            form.append(row);
        });
    },
    /**
     * @method _handleCancel
     * @private 
     * Remove form and show grid
     */
    _handleCancel: function(e, me) {
        me.container.find('.form-cont').remove();
        me.container.find('.selectors-container').show();
        me.container.find('#municipalGrid').show();
    },
    /**
     * @method _handleSubmit
     * @private 
     * Send data to backend and remove form.
     */
    _handleSubmit: function(e, me, callback) {
        var service = this.sandbox.getService('Oskari.statistics.bundle.statsgrid.UserIndicatorsService'),
            indicatorData = me._gatherData();

        if(indicatorData !== null && indicatorData !== undefined && service !== null && service !== undefined) {
            if(this.sandbox && this.sandbox.getUser().isLoggedIn()) {
                service.saveUserIndicator(indicatorData, function(indicator) {
                    me.container.find('.form-cont').remove();
                    me.container.find('.selectors-container').show();
                    me.container.find('#municipalGrid').show();
                    if(indicator.id !== null && indicator.id !== undefined) {
                        indicatorData.indicatorId = 'user_'+indicator.id;
                        callback(indicatorData);
                    }
                }, function(jqXHR, textStatus) {
                    //TODO some better way of showing errors?
                    alert(me.localization.connectionProblem);
                });
            } else {
                me.container.find('.form-cont').remove();
                me.container.find('.selectors-container').show();
                me.container.find('#municipalGrid').show();
                indicatorData.indicatorId = 'user_'+ new Date().getTime();
                callback(indicatorData);
            }
        }
    },

    /**
     * @method _parseData
     * @private 
     * Parse data from dialog (it is pasted from clipboard)
     */
    _parseData: function(e, me, dialog) {
        var inputArray = [],
            divmanazerpopup = jQuery(e.target).parents('.divmanazerpopup'),
            data = divmanazerpopup.find('textarea').val();
        //update form regions / municipalities
        var updateValue = function(name, value) {
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
                row.appendTo(row.parent());
                return true;
            }

            return false;
        };
        var lines = data.match(/[^\r\n]+/g),
            updated = 0;
            unrecognized = [];
        //loop through all the lines and parse municipalities (name or code)
        _.each(lines, function(line) {
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
            if (updateValue(jQuery.trim(area), jQuery.trim(value)))
                updated++;
            else if (value && value.length > 0)
                unrecognized.push({region: area, value: value});
        });
        var openImport = me.container.find('.import-button');
        // alert user of unrecognized lines
        var unrecognizedInfo = "";
        if (unrecognized.length > 0) {
            unrecognizedInfo = '<br>'+me.localization.parsedDataUnrecognized+': ' + unrecognized.length;
        }
        // Tell user about how many regions were imported
        var info = me.localization.parsedDataInfo+': <span class="import-indicator-bold">' + updated + '</span> ' + unrecognizedInfo;
        openImport.tooltip({ content: info, position: { my: "right-10 center", at: "left center" } });
        openImport.tooltip( "open" );

        dialog.close(true);
    },
    /**
     * @method _parseData
     * @private 
     * Parse data from dialog (it is pasted from clipboard)
     */
    _gatherData : function() {
        var me = this,
            json = {},
            emptyFields = [];

        // IE8 fix
        if (typeof String.prototype.trim !== 'function') {
            String.prototype.trim = function() {
                return this.replace(/^\s+|\s+$/g, ''); 
            };
        }
        // Get indicator title or push it to the unrecognized areas array
        var title = me.container.find('.form-meta .title').find('input').val();
        if(title === null || title === undefined || title.trim() === "") {
            emptyFields.push(me.container.find('.form-meta .title').find('label').text());
        }
        // TODO: real localized title
        json.title = JSON.stringify({'fi': title});

        var source = me.container.find('.form-meta .sources').find('input').val();
        if(source === null || source === undefined || source.trim() === "") {
            emptyFields.push(me.container.find('.form-meta .sources').find('label').text());
        }
        // TODO: real localized source
        json.source = JSON.stringify({'fi': source});

        var description = me.container.find('.form-meta .description').find('input').val();
        if(description === null || description === undefined || description.trim() === "") {
            emptyFields.push(me.container.find('.form-meta .description').find('label').text());
        }
        // TODO: real localized description
        json.description = JSON.stringify({'fi': description});

        var year = me.container.find('.form-meta .year').find('input').val();
        var text = /^[0-9]+$/;
        var currentYear = new Date().getFullYear();
        if(year === null || year === undefined || year.trim() === "" || 
            ((year !== "") && (!text.test(year))) || 
            year.length != 4 || 
            year < 1900 || 
            year > currentYear) {

            emptyFields.push(me.container.find('.form-meta .year').find('label').text());
        }
        json.year = year;

        json.material = me.layerId; //reference layer

        json.published = me.container.find('.form-meta .publicity').find('input').prop('checked');

        json.category = me.regionCategory;
        //json.category = me.container.find('.form-meta .reference-layer select').val();

        json.data = [];

        // if there was empty fields 
        if(emptyFields.length > 0) {
            var submitBtn = me.container.find('.submit-form-button');
            var failedSubmit = me.localization.failedSubmit +'<br>'+ emptyFields.join(", ");
            submitBtn.attr('title', failedSubmit);
            submitBtn.tooltip({ content: failedSubmit, position: { my: "right bottom-10", at: "right top" } });
            submitBtn.tooltip( "open" );
            setTimeout(function() {
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
                if(value !== null && value !== undefined && value.trim() !== "") {
                    json.data.push({
                        'region': row.attr('data-id'),
                        'primary value' : value
                    });
                }
            }
            json.data = JSON.stringify(json.data);
            return json;
        }
    },

    /**
     * @method validateYear
     * Validate year (keypress & blur)
     */
    validateYear: function(year,e) {
        var text = /^[0-9]+$/;
        if(e.type=="blur" || 
            year.length === 4 && e.keyCode !== 8 && e.keyCode !== 46 && e.keyCode !== 37 && e.keyCode !== 39) {
            if (year !== 0 && year !== '0') {
                var current = jQuery(e.target);
                if ((year !== "") && (!text.test(year))) {
                    //alert("Please Enter Numeric Values Only");
                    current.css({'color': '#ff0000'});
                    return false;
                }
                if (year.length != 4) {
                    //alert("Year is not proper. Please check");
                    current.css({'color': '#ff0000'});
                    return false;
                }
                var currentYear = new Date().getFullYear();
                if((year < 1900) || (year > currentYear)) {
                    //alert("Year should be in range 1920 to current year");
                    current.css({'color': '#ff0000'});
                    return false;
                }
                current.css({'color': '#878787'});
                return true;
            }
        }
    }
});
