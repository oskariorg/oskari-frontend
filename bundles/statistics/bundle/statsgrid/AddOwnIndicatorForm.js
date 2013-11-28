/**
 * @class Oskari.statistics.bundle.statsgrid.StatsToolbar
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.AddOwnIndicatorForm', 
/**
 * @static constructor function
 * @param {Object} localization
 * @param {Oskari.statistics.bundle.statsgrid.StatsGridBundleInstance} instance
 */
function(sandbox, localization, municipalityData, layerWMSName, layerId) {
    this.sandbox = sandbox;
    this.localization = localization;
    this.municipalities = municipalityData;
    this.layerWMSName = layerWMSName;
    this.layerId = layerId;

    this.template = {
        'formCont' : '<div class="form-cont"></div>',
        'formHead' : '<div class="form-head"><h2></h2></div>',
        'formShowImport' : '<div class="form-show-import"><button class="import-button"></button></div>',
        'formImport' : '<div class="form-import"><textarea class="import-textarea"></textarea><button class="start-import"></button></div>',
        'formMeta' : '<div class="form-meta"><div class="title"><label></label><input type="text" required></div><div class="sources"><label></label><input type="text" required></div><div class="description"><label></label><input type="text" required></div><div class="year"><label></label><input type="text" required></div><div class="reference-layer"><label></label><span></span></div><div class="publicity"><label></label><input type="checkbox"></div></div>',
        'formMunicipalities': '<div class="municipalities"></div>',
        'formMunicipalityHeader': '<div class="municipality-header"><label></label><hr></div>',
        'formMunicipalityRow': '<div class="municipality-row"><label></label><input type="text"></div>',
        'formSubmit':'<div class="form-submit"><button class="submit-form-button" title=""></button><button class="cancel-form-button"></button></div>',
        'importDataPopup' : '<div class="import-data-popup"><p class="import-data-desc"></p><div class="import-container"><textarea class="import-data-textarea"></textarea></div></div>'
    }
}, {
	/**
	 * @method _createUI
	 * Create UI for the form
	 */
	createUI : function(container, callback) {
        var me = this;
        var formCont = jQuery(me.template.formCont).clone(),
            formHead = jQuery(me.template.formHead).clone(),
            formShowImport = jQuery(me.template.formShowImport).clone(),
            formMeta = jQuery(me.template.formMeta).clone(),
            formMunicipalityHeader = jQuery(me.template.formMunicipalityHeader).clone(),
            formMunicipalities = jQuery(me.template.formMunicipalities).clone(),
            formSubmit = jQuery(me.template.formSubmit).clone();

        me.container = container;

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
        formMeta.find('.reference-layer').find('span').append(me.layerWMSName);
        formMeta.find('.publicity').find('label').append(this.localization.addDataMetaPublicity);

        formHead.find('h2').append(me.localization.addDataTitle);

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

        formMunicipalityHeader.find('label').append(me.localization.municipalityHeader);

        var cancel = formSubmit.find('.cancel-form-button');
        cancel.append(me.localization.formCancel);
        cancel.click(function(e) {
//TODO testi
var indicatorData = me._gatherData();
if(indicatorData != null) {
    callback(indicatorData);
}
            me._handleCancel(e, me);

        })
        var submit = formSubmit.find('.submit-form-button');
        submit.append(me.localization.formSubmit);
        submit.click(function(e) {
//            var indicatorData = me._gatherData();
            me._handleSubmit(e, me, callback);
        })

        formCont
            .append(formHead)
            .append(formMeta)
            .append(formShowImport)
            .append(formMunicipalityHeader)
            .append(formMunicipalities)
            .append(formSubmit);

        for (var i = 0; i < me.municipalities.length; i++) {
            var municipality = me.municipalities[i];
            var formMunicipalityRow = jQuery(me.template.formMunicipalityRow).clone();
            var m = municipality.municipality.toLowerCase();
            formMunicipalityRow
                .attr('data-name', m)
                .attr('data-code', municipality.code)
                .attr('data-id', municipality.id)                
                .find('label')
                .attr('for', 'municipality_'+ m)
                .append(municipality.municipality + " (" + municipality.code + ")");
            formMunicipalityRow
                .find('input')
                .attr('id', 'municipality_'+ m)
                .attr('placeholder', me.localization.municipalityPlaceHolder);

            formMunicipalities.append(formMunicipalityRow);
        };

        container.append(formCont);

	},
    _handleCancel: function(e, me) {
        me.container.find('.form-cont').remove();
        me.container.find('.selectors-container').show();
        me.container.find('#municipalGrid').show();
    },
    _handleSubmit: function(e, me, callback) {
        var indicatorData = me._gatherData();

        if(indicatorData != null) {
            $.ajax({
                url : me.sandbox.getAjaxUrl() + 'action_route=SaveUserIndicator',
                type: "POST",
                data : indicatorData,
                success: function(data, textStatus, jqXHR){
                    //data - response from server
                    me.container.find('.form-cont').remove();
                    me.container.find('.selectors-container').show();
                    me.container.find('#municipalGrid').show();
                    callback(indicatorData);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert(me.localization.connectionProblem);
                }
            });
        }
    },

    _parseData: function(e, me, dialog) {
        var inputArray = [];
        var divmanazerpopup = jQuery(e.target)
            .parents('.divmanazerpopup');

        var data = divmanazerpopup.find('textarea').val();

        var updateRegion = function(name, value) {
            if(/^\d+$/.test(value)) {
                var rows = me.container.find('.municipality-row');
                for (var i = 0; i < rows.length; i++) {
                    var row = jQuery(rows[i]);
                    var code = row.attr('data-code');
                    if(code === name) {
                        row.find('input').val(value);
                        return true;
                    }
                };
            }
            var input = me.container.find('#municipality_'+name.toLowerCase());
            if(input.length > 0) {
                input.val(value);
                return true;
            }
            return false;
        }
        var lines = data.match(/[^\r\n]+/g);
        var matchCount = 0;
        var unknown = [];
        _.each(lines, function(line) {
            var area,
                value;

            var matches = line.split("\t");
            if (matches.length > 1) {
                area = matches[0];
                value = matches[1];
            } else {
                matches = line.match(/(.*) *[\t:,]+ *(.*)/);
                if (matches && matches.length === 3) {
                    area = matches[1];
                    value = matches[2]
                }
            }

            if (updateRegion($.trim(area), $.trim(value)))
                matchCount++;
            else if (value && value.length > 0)
                unknown.push(area)
        });
        var openImport = me.container.find('.import-button');

        var unknownText = "";
        if (unknown.length > 0) {
            unknownText = '<br>Tunnistamattomia alueita: ' + unknown.length;
        }
        var infoText = 'Tuotuja alueita oli yhteensä: <span style="font-size: 1.2em; font-weight: bold;">' + matchCount + '</span> ' + unknownText;
        openImport.tooltip({ content: infoText, position: { my: "right-10 center", at: "left center" } });
        openImport.tooltip( "open" );

        dialog.close(true);

    },
    _gatherData : function() {
        var me = this;
        var json = {};
        var emptyFields = [];

        // IE8 fix
        if(typeof String.prototype.trim !== 'function') {
            String.prototype.trim = function() {
                return this.replace(/^\s+|\s+$/g, ''); 
            }
        }

        var title = me.container.find('.form-meta .title').find('input').val();
        if(title == null || title.trim() == "") {
            emptyFields.push(me.container.find('.form-meta .title').find('label').text());
        }
        json.title = JSON.stringify({'fi': title});

        var source = me.container.find('.form-meta .sources').find('input').val();
        if(source == null || source.trim() == "") {
            emptyFields.push(me.container.find('.form-meta .sources').find('label').text());
        }
        json.source = JSON.stringify({'fi': source});

        var description = me.container.find('.form-meta .description').find('input').val();
        if(description == null || description.trim() == "") {
            emptyFields.push(me.container.find('.form-meta .description').find('label').text());
        }
        json.description = JSON.stringify({'fi': description});

        var year = me.container.find('.form-meta .year').find('input').val();
        if(year == null || year.trim() == "") {
            emptyFields.push(me.container.find('.form-meta .year').find('label').text());
        }
        json.year = year;

        json.material = me.layerId; //reference layer

        json.published = me.container.find('.form-meta .publicity').find('input').prop('checked');

        json.data = [];

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

            var municipalityRows = me.container.find('.municipality-row');
            for (var i = 0; i < municipalityRows.length; i++) {
                var row = jQuery(municipalityRows[i]);
                var input = row.find('input');
                var value = input.val();
                if(value != null && value.trim() != "") {
                    json.data.push({
                        'region': row.attr('data-id'),
                        'primary value' : value
                    });
                }
            };
            return json;
        }
    },

    validateYear: function(year,e) {
        var text = /^[0-9]+$/;
        if(e.type=="blur" || 
            year.length == 4 && e.keyCode != 8 && e.keyCode != 46 && e.keyCode != 37 && e.keyCode!= 39) {
            if (year != 0) {
                var current = jQuery(e.target);
                if ((year != "") && (!text.test(year))) {
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
