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
    border: '1px solid #d9d9d9',
    height: previewSize,
    width: previewSize
};

const getSVGContent = (format, propsForSVG, markers, areaFills) => {
    if (format === 'point') {
        return getPointSVG(propsForSVG, markers);
    } else if (format === 'line') {
        return getLineSVG(propsForSVG);
    } else if (format === 'area') {
        return getAreaSVG(propsForSVG, areaFills);
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
    return (
        <div style={ previewWrapperStyle } className="t_preview" { ...flagsForSelenium } >
            <SVGWrapper
                width={ previewSize }
                height={ previewSize }
                content={ svgIcon }
                iconSize={ format === 'point' ? propsForSVG.size : null} />
        </div>
    );
};

Preview.propTypes = {
    oskariStyle: PropTypes.object.isRequired,
    format: PropTypes.string.isRequired,
    markers: PropTypes.array,
    areaFills: PropTypes.array
};
