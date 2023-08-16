import React from 'react';
import PropTypes from 'prop-types';
import { getAsDataAttributes, PointPreview, LinePreview, AreaPreview } from './Preview/';

// Size for preview svg
const previewSize = 80;

// Style settings for wrapping preview rectangle
const previewWrapperStyle = {
    height: previewSize,
    width: previewSize,
    marginLeft: 'auto',
    marginRight: 'auto'
};

/**
 * @class Preview
 * @calssdesc <Preview>
 * @memberof module:oskari-ui
 * @see {@link module:oskari-ui/util.LocaleProvider|LocaleProvider}
 * @param {Object} props - { }
 * @description Wrap provided svg-icon into base svg of preview
 * 
 * @example <caption>Basic usage</caption>
 * <Preview }/>
 */
export const Preview = ({format, oskariStyle, style = {}}) => {
    const { fill, stroke, image } = oskariStyle;
    const flagsForSelenium = getAsDataAttributes(format, oskariStyle);
    const mergedStyle = { ...previewWrapperStyle, ...style };

    return (
        <div style={ mergedStyle } className="t_preview" { ...flagsForSelenium } >
            { format === 'point' && <PointPreview imageDef={ image } /> }
            { format === 'line' && <LinePreview previewSize={ previewSize } strokeDef={ stroke } /> }
            { format === 'area' && <AreaPreview previewSize={ previewSize } strokeDef={ stroke.area } fillDef = { fill } /> }
        </div>
    );
};

Preview.propTypes = {
    oskariStyle: PropTypes.object.isRequired,
    format: PropTypes.string.isRequired
};
