import React from 'react';
import PropTypes from 'prop-types';
import { StyleMapper, PointPreview, LinePreview, AreaPreview } from './Preview/';

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
    const propsForSVG = StyleMapper.getPropsForFormat(format, oskariStyle);
    const flagsForSelenium = StyleMapper.getAsDataAttributes(format, propsForSVG);
    const mergedStyle = { ...previewWrapperStyle, ...style };

    return (
        <div style={ mergedStyle } className="t_preview" { ...flagsForSelenium } >
            { format === 'point' && <PointPreview previewSize={ previewSize } propsForSVG={ propsForSVG } /> }
            { format === 'line' && <LinePreview previewSize={ previewSize } propsForSVG={ propsForSVG } /> }
            { format === 'area' && <AreaPreview previewSize={ previewSize } propsForSVG={ propsForSVG } /> }
        </div>
    );
};

Preview.propTypes = {
    oskariStyle: PropTypes.object.isRequired,
    format: PropTypes.string.isRequired
};
