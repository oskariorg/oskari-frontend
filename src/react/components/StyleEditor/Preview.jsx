import React from 'react';
import PropTypes from 'prop-types';
import { StyleMapper } from './Preview/StyleMapper';
import { SVGWrapper } from './Preview/SVGWrapper';
import { getPointSVG } from './Preview/point';
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
    if (format === 'point') {
        return getPointSVG(propsForSVG);
    } else if (format === 'line') {
        return getLineSVG(propsForSVG);
    } else if (format === 'area') {
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
export const Preview = ({markers, areaFills, format, oskariStyle}) => {
    const propsForSVG = StyleMapper.getPropsForFormat(format, oskariStyle);
    const flagsForSelenium = StyleMapper.getAsDataAttributes(format, propsForSVG);
    const svgIcon = getSVGContent(format, propsForSVG, markers, areaFills);
    const size = format === 'point' ? propsForSVG.size : undefined;
    return (
        <div style={ previewWrapperStyle } className="t_preview" { ...flagsForSelenium } >
            <SVGWrapper
                width={ previewSize }
                height={ previewSize }
                content={ svgIcon }
                iconSize={ size } />
        </div>
    );
};

Preview.propTypes = {
    oskariStyle: PropTypes.object.isRequired,
    format: PropTypes.string.isRequired
};
