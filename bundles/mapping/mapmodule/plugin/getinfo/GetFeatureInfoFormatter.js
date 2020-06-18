import { getFormatter } from './ValueFormatters';
const ID_SKIP_LABEL = '$SKIP$__';

Oskari.clazz.category('Oskari.mapframework.mapmodule.GetInfoPlugin', 'formatter', {
    __templates: {
        wrapper: '<div></div>',
        getinfoResultTable: '<table class="getinforesult_table"></table>',
        tableRow: '<tr></tr>',
        tableCell: '<td></td>',
        header: '<div class="getinforesult_header"><div class="icon-bubble-left"></div>',
        headerTitle: '<div class="getinforesult_header_title"></div>',
        myPlacesWrapper: '<div class="myplaces_place">' +
            '<div class="getinforesult_header"><div class="icon-bubble-left"></div><div class="getinforesult_header_title myplaces_header"></div></div>' +
            '<p class="myplaces_desc"></p>' +
            '<a class="myplaces_imglink" target="_blank" rel="noopener"><img class="myplaces_img"></img></a>' + '<br><a class="myplaces_link" target="_blank" rel="noopener"></a>' + '</div>',
        linkOutside: '<a target="_blank" rel="noopener"></a>'
    },
    formatters: {
        html: function (datumContent) {
            // html has to be put inside a container so jquery behaves
            var parsedHTML = jQuery('<div></div>').append(datumContent);
            // Remove stuff from head etc. that we don't need/want
            parsedHTML.find('link, meta, script, style, title').remove();
            // Add getinforesult class etc. so the table is styled properly
            parsedHTML.find('table').addClass('getinforesult_table');
            // FIXME this is unnecessary, we can do this with a css selector.
            parsedHTML.find('tr').removeClass('odd');
            parsedHTML.find('tr:even').addClass('odd');
            return parsedHTML;
        },
        /**
         * Formats the html to show for my places layers' gfi dialog.
         *
         * @method myplace
         * @param {Object} place response data to format
         * @return {jQuery} formatted html
         */
        myplace: function (place) {
            var content = jQuery('<div class="myplaces_place">' +
                '<h3 class="myplaces_header"></h3>' +
                    '<p class="myplaces_desc"></p>' +
                    '<a class="myplaces_imglink" target="_blank"><img class="myplaces_img"></img></a>' +
                    '<br><a class="myplaces_link" target="_blank" rel="noopener"></a>' +
                '</div>');
            var desc = content.find('p.myplaces_desc');
            var img = content.find('a.myplaces_imglink');
            var link = content.find('a.myplaces_link');

            content.find('h3.myplaces_header').html(place.name);

            if (place.place_desc) {
                desc.html(place.place_desc);
            } else if (place.description) {
                desc.html(place.description);
            } else {
                desc.remove();
            }

            if (place.image_url && typeof place.image_url === 'string') {
                img.attr({
                    'href': place.image_url
                }).find('img.myplaces_img').attr({
                    'src': place.image_url
                });
            } else if (place.imageUrl && typeof place.imageUrl === 'string') {
                img.attr({
                    'href': place.imageUrl
                }).find('img.myplaces_img').attr({
                    'src': place.imageUrl
                });
            } else {
                img.remove();
            }

            if (place.link) {
                link.attr({
                    'href': place.link
                }).html(place.link);
            } else {
                link.remove();
            }

            return content;
        },
        /**
         * @method json
         * @private
         * Formats a GFI response value to a jQuery object
         * @param {pValue} datum response data to format
         * @return {jQuery} formatted HMTL
         */
        json: function (pValue) {
            if (!pValue) {
                return;
            }
            var value = jQuery('<span></span>');
            // if value is an array -> format it first
            // TODO: maybe some nicer formatting?
            if (Array.isArray(pValue)) {
                var i,
                    obj,
                    objAttr,
                    innerValue,
                    pluginLoc,
                    myLoc,
                    localizedAttr;

                for (i = 0; i < pValue.length; i += 1) {
                    obj = pValue[i];
                    for (objAttr in obj) {
                        if (obj.hasOwnProperty(objAttr)) {
                            innerValue = this.formatters.json(obj[objAttr]);
                            if (innerValue) {
                                // Get localized attribute name
                                // TODO this should only apply to omat tasot?
                                pluginLoc = this.getMapModule().getLocalization('plugin', true);
                                myLoc = pluginLoc[this._name];
                                localizedAttr = myLoc[objAttr];
                                value.append(localizedAttr || objAttr);
                                value.append(': ');
                                value.append(innerValue);
                                value.append('<br class="innerValueBr" />');
                            }
                        }
                    }
                }
            } else if (pValue.indexOf && pValue.indexOf('://') > 0 && pValue.indexOf('://') < 7) {
                var link = jQuery('<a target="_blank" rel="noopener"></a>');
                link.attr('href', pValue);
                link.append(pValue);
                value.append(link);
            } else {
                value.append(pValue);
            }
            return value;
        },
        /**
         * Checks if the given string is a html document
         *
         * @method _isHTML
         * @private
         * @param datumContent
         * @return true if includes HTML tag
         */
        isHTML: function (datumContent) {
            if (typeof datumContent === 'string') {
                return datumContent.toLowerCase().indexOf('<html') !== -1;
            }
            return false;
        }
    },
    /**
     * Wraps the html feature fragments into a container.
     *
     * @method _renderFragments
     * @private
     * @param  {Object[]} fragments
     * @return {jQuery}
     */
    _renderFragments: function (fragments) {
        var me = this;

        const baseDiv = me.template.wrapper.clone();
        fragments
            .map(fragment => {
                var fragmentTitle = fragment.layerName;
                var fragmentMarkup = fragment.markup;
                if (fragment.isMyPlace) {
                    if (fragmentMarkup) {
                        return fragmentMarkup;
                    }
                    return;
                }
                const contentWrapper = me.template.wrapper.clone();
                var headerWrapper = me.template.header.clone();
                var titleWrapper = me.template.headerTitle.clone();

                titleWrapper.append(fragmentTitle);
                titleWrapper.attr('title', fragmentTitle);
                headerWrapper.append(titleWrapper);
                contentWrapper.append(headerWrapper);

                if (fragmentMarkup) {
                    contentWrapper.append(fragmentMarkup);
                }
                return contentWrapper;
            })
            .filter(frag => typeof frag !== 'undefined')
            .forEach(frag => baseDiv.append(frag));
        return baseDiv;
    },
    /**
     * Parses and formats a GFI response
     *
     * @method _parseGfiResponse
     * @private
     * @param {Object} resp response data to format
     * @return {Object} object { fragments: coll, title: title } where
     *  fragments is an array of JSON { markup: '<html-markup>', layerName:
     * 'nameforlayer', layerId: idforlayer }
     */
    _parseGfiResponse: function (data) {
        if (data.layerCount === 0) {
            return;
        }
        const me = this;
        const sandbox = this._sandbox;

        const coll = data.features
            .map(function (datum) {
                const pretty = me._formatGfiDatum(datum);
                if (typeof pretty === 'undefined') {
                    return;
                }

                const layer = sandbox.findMapLayerFromSelectedMapLayers(datum.layerId);
                const layerName = layer ? layer.getName() : '';
                const layerIdString = datum.layerId + '';

                return {
                    markup: pretty,
                    layerId: layerIdString,
                    layerName: layerName,
                    type: datum.type,
                    isMyPlace: !!layerIdString.match('myplaces_')
                };
            })
            .filter(feature => typeof feature !== 'undefined');

        return coll || [];
    },

    /**
     * Formats a GFI HTML or JSON object to result HTML
     *
     * @method _formatGfiDatum
     * @private
     * @param {Object} datum response data to format
     * @return {jQuery} formatted HMTL
     */
    _formatGfiDatum: function (datum) {
        // FIXME this function is too complicated, chop it to pieces
        if (!datum.presentationType) {
            return null;
        }

        var me = this,
            response = me.template.wrapper.clone();

        if (datum.presentationType === 'JSON' || (datum.content && datum.content.parsed)) {
            // This is for my places info popup
            if (datum.layerId && typeof datum.layerId === 'string' && datum.layerId.match('myplaces_')) {
                const baseDiv = jQuery('<div></div>');
                datum.content.parsed.places
                    .map(place => me.formatters.myplace(place))
                    .forEach(place => baseDiv.append(place));
                return baseDiv;
            }

            var even = false,
                rawJsonData = datum.content.parsed,
                dataArray = [],
                i,
                attr,
                jsonData,
                table,
                value,
                row,
                labelCell,
                pluginLoc,
                myLoc,
                localizedAttr,
                valueCell;

            if (Object.prototype.toString.call(rawJsonData) === '[object Array]') {
                dataArray = rawJsonData;
            } else {
                dataArray.push(rawJsonData);
            }

            for (i = 0; i < dataArray.length; i += 1) {
                jsonData = dataArray[i];
                table = me.template.getinfoResultTable.clone();
                for (attr in jsonData) {
                    if (!jsonData.hasOwnProperty(attr)) {
                        continue;
                    }
                    value = me.formatters.json(jsonData[attr]);
                    if (!value) {
                        continue;
                    }
                    row = me.template.tableRow.clone();
                    // FIXME this is unnecessary, we can do this with a css selector.
                    if (!even) {
                        row.addClass('odd');
                    }
                    even = !even;

                    labelCell = me.template.tableCell.clone();
                    // Get localized name for attribute
                    // TODO this should only apply to omat tasot?
                    pluginLoc = this.getMapModule().getLocalization('plugin', true);
                    myLoc = pluginLoc[this._name];
                    localizedAttr = myLoc[attr];
                    labelCell.append(localizedAttr || attr);
                    row.append(labelCell);
                    valueCell = me.template.tableCell.clone();
                    valueCell.append(value);
                    row.append(valueCell);
                    table.append(row);
                }
                response.append(table);
            }
        } else if (datum.content === '') {
            // no content
            return null;
        } else if (me.formatters.isHTML(datum.content)) {
            var parsedHTML = me.formatters.html(datum.content);
            if (jQuery.trim(parsedHTML.html()) === '') {
                return null;
            }
            response.append(parsedHTML.html());
        } else {
            response.append(datum.content);
        }
        // custom "footer"
        if (datum.gfiContent) {
            var trimmed = datum.gfiContent.trim();
            if (trimmed.length) {
                response.append(trimmed);
            }
        }
        return response;
    },

    /**
     * @method _formatWFSFeaturesForInfoBox
     */
    _formatWFSFeaturesForInfoBox: function (data) {
        var me = this;
        const { layerId, features } = data;
        if (typeof layerId === 'undefined' || typeof features === 'undefined') {
            return;
        }
        const layer = this._sandbox.findMapLayerFromSelectedMapLayers(layerId);
        if (features === 'empty' || !layer) {
            return;
        }
        const isMyPlace = layer.isLayerOfType('myplaces');
        var fields = layer.getFields().slice();
        const noDataResult = `<table><tr><td>${this._loc.noAttributeData}</td></tr></table>`;

        if (!fields.length) {
            // layer doesn't have fields, "return no data"
            return [{
                markup: noDataResult,
                layerId,
                layerName: layer.getName(),
                type: 'wfslayer',
                isMyPlace
            }];
        }

        const locales = layer.getLocales().slice();
        const hiddenFields = ['__fid', '__centerX', '__centerY'];
        // use localized labels for properties when available instead of property names
        // keep property names for my places as it has custom formatter
        const localeMapping = fields.reduce((result, value, index) => {
            if (isMyPlace) {
                return result;
            }
            // return the localized name, fallback to actual property name if localization is missing
            const label = locales[index] || value;
            result[value] = label;
            return result;
        }, {});

        const result = data.features.map(featureValues => {
            let markup;
            // featureValues is an array of values based on fields order
            const feature = fields
                // .filter(prop => !hiddenFields.includes(prop))
                .reduce((result, prop, index) => {
                    if (hiddenFields.includes(prop)) {
                        // skip hidden fields for ui presentation but dont filter so the index is not mixed up(?)
                        return result;
                    }
                    // construct object for UI having only selected fields with localized labels
                    let uiLabel = localeMapping[prop] || prop;
                    const value = featureValues[index];
                    let formatterOpts = {};
                    if (typeof layer.getFieldFormatMetadata === 'function') {
                        formatterOpts = layer.getFieldFormatMetadata(prop);
                    }
                    const formatter = getFormatter(formatterOpts.type);
                    if (typeof value !== 'undefined') {
                        if (formatterOpts.noLabel === true) {
                            uiLabel = ID_SKIP_LABEL + uiLabel;
                        }
                        result[uiLabel] = formatter(value, formatterOpts.params);
                    }
                    return result;
                }, {});

            if (isMyPlace) {
                markup = me.formatters.myplace(feature);
            } else if (Object.keys(feature).length > 0) {
                markup = me._json2html(feature);
            } else {
                markup = noDataResult;
            }
            return {
                markup,
                layerId,
                layerName: layer.getName(),
                type: 'wfslayer',
                isMyPlace
            };
        });

        return result;
    },

    /**
     * @method _json2html
     * @private
     * Parses and formats a WFS layers JSON GFI response
     * @param {Object} node response data to format
     * @return {String} formatted HMTL
     */
    _json2html: function (node) {
        // FIXME this function is too complicated, chop it to pieces
        if (node === null || node === undefined) {
            return '';
        }
        var even = true,
            html = this.template.getinfoResultTable.clone(),
            row = null,
            keyColumn = null,
            valColumn = null,
            arrayObject = {},
            key,
            value,
            vType,
            valpres,
            valueDiv,
            innerTable,
            i;
        for (key in node) {
            if (!node.hasOwnProperty(key)) {
                continue;
            }
            value = node[key];

            if (value === null || value === undefined ||
                    key === null || key === undefined) {
                continue;
            }
            vType = (typeof value).toLowerCase();
            valpres = '';
            switch (vType) {
            case 'string':
                if (value.indexOf('http://') === 0 || value.indexOf('https://') === 0) {
                    valpres = this.template.linkOutside.clone();
                    valpres.attr('href', value);
                    valpres.append(value);
                } else {
                    valpres = value;
                }
                break;
            case 'undefined':
                valpres = 'n/a';
                break;
            case 'boolean':
                valpres = (value ? 'true' : 'false');
                break;
            case 'number':
                valpres = '' + value;
                break;
            case 'function':
                valpres = '?';
                break;
            case 'object':
                // format array
                if (jQuery.isArray(value)) {
                    valueDiv = this.template.wrapper.clone();
                    if (value.length > 0) {
                        if ((typeof value[0]).toLowerCase() === 'object') {
                            for (i = 0; i < value.length; i += 1) {
                                innerTable = this._json2html(value[i]);
                                valueDiv.append(innerTable);
                            }
                            valpres = valueDiv;
                        } else {
                            // Create object for array values
                            for (i = 0; i < value.length; i += 1) {
                                arrayObject[key + '.' + i] = value[i];
                            }
                            valpres = this._json2html(arrayObject);
                        }
                    }
                } else {
                    valpres = this._json2html(value);
                }
                break;
            default:
                valpres = '';
            }
            even = !even;

            row = this.template.tableRow.clone();
            // FIXME this is unnecessary, we can do this with a css selector.
            if (!even) {
                row.addClass('odd');
            }
            const skipLabel = key.startsWith(ID_SKIP_LABEL);
            if (!skipLabel) {
                keyColumn = this.template.tableCell.clone();
                keyColumn.append(key);
                row.append(keyColumn);
            }

            valColumn = this.template.tableCell.clone();
            if (skipLabel) {
                valColumn.attr('colspan', 2);
            }
            valColumn.append(valpres);
            row.append(valColumn);

            html.append(row);
        }
        return html;
    }
});
