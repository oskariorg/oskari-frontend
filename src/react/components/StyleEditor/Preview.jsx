import React from 'react';
import PropTypes from 'prop-types';
import { StyleMapper } from './Preview/StyleMapper';
import { SVGWrapper } from './Preview/SVGWrapper';
import { getLineSVG } from './Preview/line';
import { getAreaSVG } from './Preview/area';

// Size for preview svg
const previewSize = '80px';

// Style settings for wrapping preview rectangle
const previewWrapperStyle = {
    height: previewSize,
    width: previewSize,
    marginLeft: 'auto',
    marginRight: 'auto'
};

const getSVGContent = (format, propsForSVG) => {
    if (format === 'line') {
        return getLineSVG(propsForSVG);
    }
    if (format === 'area') {
        return getAreaSVG(propsForSVG);
    }
    return '';
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
    if (format === 'point') {
        return (
            <div style={ mergedStyle } className="t_preview" { ...flagsForSelenium } >
                <SVGWrapper
                    width={ previewSize }
                    height={ previewSize }
                    propsForSVG={ propsForSVG } />
            </div>
        );
    }
    return (
        <div style={ mergedStyle } className="t_preview" { ...flagsForSelenium }
            dangerouslySetInnerHTML={ { __html: getSVGContent(format, propsForSVG) } }>

        </div>
    );

};

Preview.propTypes = {
    oskariStyle: PropTypes.object.isRequired,
    format: PropTypes.string.isRequired
};
