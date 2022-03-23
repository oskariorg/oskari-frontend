import { COLOR_SETS } from './constants';
/**
 * @class Oskari.statistics.statsgrid.ColorService
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.ColorService',

    /**
     * @method create called automatically on construction
     * @static
     *
     */

    function () {
        this._defaults = {
            color: '#2ba7ff',
            colorSet: 'Blues'
        };
        this._limits = {
            types: ['div', 'seq', 'qual'],
            names: COLOR_SETS.map(set => set.name)
        };
        this.initColorset();
    }, {
        __name: 'StatsGrid.ColorService',
        __qname: 'Oskari.statistics.statsgrid.ColorService',

        getQName: function () {
            return this.__qname;
        },
        getName: function () {
            return this.__name;
        },
        initColorset: function () {
            this.colorsets = COLOR_SETS.map(set => {
                const { colors, ...rest } = set;
                return {
                    ...rest,
                    colors: colors.map(str => str.split(',').map(color => '#' + color))
                };
            });
        },
        getAvailableTypes: function () {
            return [...this._limits.types];
        },
        /**
         * [getColorsForClassification description]
         * @param  {Object} classification object with count as number, type as string, name as string and optional reverseColors boolean
         * @return {Object[]} array of colors to use for legend and map
         */
        getColorsForClassification: function (classification) {
            const { mapStyle, count, color, reverseColors } = classification;
            let set = [];
            if (mapStyle === 'points') {
                for (let i = 0; i < count; i++) {
                    set.push(color || this._defaults.color);
                }
            } else {
                set = this.getColorset(count, color);
            }
            return reverseColors ? [...set].reverse() : set;
        },
        getDividedColors: function (classification, bounds) {
            const { count, color, reverseColors, base = 0 } = classification;
            const isEven = count % 2 === 0;
            const colorCount = isEven ? 2 : 3;
            const colorset = [...this.getColorset(colorCount, color)];
            if (reverseColors) {
                colorset.reverse();
            }
            const baseIndex = bounds.findIndex(bound => bound >= base);
            const colors = [];
            if (isEven) {
                for (let i = 0; i < bounds.length - 1; i++) {
                    colors[i] = i < baseIndex ? colorset[0] : colorset[1];
                }
            } else {
                for (let i = 0; i < bounds.length - 1; i++) {
                    if (i === baseIndex) {
                        colors[i] = colorset[1];
                    } else {
                        colors[i] = i < baseIndex ? colorset[0] : colorset[2];
                    }
                }
            }
            return colors;
        },
        /**
         * Tries to return an array of colors where length equals count parameter.
         * If such set is not available, throws Error
         * @param  {Number} count number of colors requested
         * @param  {String} name  name
         * @param  {String} type  optional type
         * @return {String[]}     array of hex-strings as colors like ["#d8b365","#5ab4ac"]
         */
        getColorset: function (count, name, type) {
            const colorset = this.colorsets.find(set => set.name === name);
            if (!colorset) {
                throw new Error('No matching colorset found!');
            }
            if (type && type !== colorset.type) {
                throw new Error('Requested type does not match to colorset!');
            }
            // 2 colors is the first set and index starts at 0 -> -2
            const colors = colorset.colors[count - 2];
            if (!colors || colors.length !== count) {
                throw new Error(`Failed to get colorset: ${name} with ${count} colors.`);
            }
            return colors;
        },
        /**
         * Returns the min/max amount of colors for a type
         * @param  {String} type Colorset type
         * @return {Object} with keys min and max { min : 2, max : 9 }
         */
        getRange: function (type) {
            // 2 colors is in the colors[0], assume that every next item has one color more
            const max = this.colorsets.filter(set => set.type === type)
                .map(set => set.colors.length)
                .reduce((max, size) => max > size ? max : size);
            return { min: 2, max: max + 2 };
        },
        validateColor: function (color, mapStyle, type) {
            if (mapStyle === 'points' && type !== 'div') {
                return !!Oskari.util.hexToRgb(color);
            }
            const colorset = this.colorsets.find(set => set.name === color);
            const { type: setType } = colorset || {};
            return setType === type;
        },
        getDefaultColorForType: function (mapStyle, type) {
            if (mapStyle === 'points' && type !== 'div') {
                return this._defaults.color;
            }
            if (!this.getAvailableTypes().includes(type)) {
                throw new Error(`Invalid type: ${type}`);
            }
            return this.colorsets.find(set => set.type === type).name;
        },
        /**
         * Options to show in classification UI for selected type and count
         * @param  {String} type  Colorset type.
         * @param  {Number} count amount of colors (throws an error if out of range)
         * @return {Object[]} Returns an array of objects like { name : "nameOfSet", colors : [.. array of hex colors...]}
         */
        getOptionsForType: function (type, count, reverse) {
            const range = this.getRange(type);
            if (typeof count !== 'number' || range.min > count || range.max < count) {
                throw new Error('Invalid color count provided: ' + count +
                    '. Should be between ' + range.min + '-' + range.max + ' for type ' + type);
            }
            // 2 colors is the first set and index starts at 0 -> -2
            const arrayIndex = count - 2;

            return this.colorsets
                .filter(set => set.type === type && arrayIndex < set.colors.length)
                .map(set => {
                    const { name } = set;
                    const colors = set.colors[arrayIndex];
                    return {
                        name,
                        colors: reverse ? [...colors].reverse() : colors
                    };
                });
        }
    }, {
        'protocol': ['Oskari.mapframework.service.Service']
    });
