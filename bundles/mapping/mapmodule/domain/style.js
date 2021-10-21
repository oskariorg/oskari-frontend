export class Style {
    constructor (name = null, title = null, legend = null) {
        this._name = name;
        this._title = title;
        this._legend = legend;
    }

    /**
     * @method setName
     * Sets name for the style
     *
     * @param {String} name
     *            style name
     */
    setName (name) {
        this._name = name;
    }

    /**
     * @method getName
     * Gets name for the style
     *
     * @return {String} style name
     */
    getName () {
        return this._name;
    }

    /**
     * @method setTitle
     * Sets title for the style
     *
     * @param {String} title
     *            style title
     */
    setTitle (title) {
        this._title = title;
    }

    /**
     * @method getTitle
     * Gets title for the style
     *
     * @return {String} style title
     */
    getTitle () {
        return this._title;
    }

    /**
     * @method setLegend
     * Sets legendimage URL for the style
     *
     * @param {String} legend
     *            style legend
     */
    setLegend (legend) {
        this._legend = legend;
    }

    /**
     * @method getLegend
     * Gets legendimage URL for the style
     *
     * @return {String} style legend
     */
    getLegend () {
        return this._legend;
    }
}

/**
 * @class Oskari.mapframework.domain.Style
 *
 * Map Layer Style
 */
Oskari.clazz.defineES(
    'Oskari.mapframework.domain.Style',
    Style,
    {}
);
