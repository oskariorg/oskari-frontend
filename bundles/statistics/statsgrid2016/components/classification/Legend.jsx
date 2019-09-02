import React from 'react';
import PropTypes from 'prop-types';
import { withContext } from 'oskari-ui/util';
import './legend.scss';

const createLegendHTML = props => {
    const { loc, legendProps } = props;
    const indicatorData = props.indicatorData.data;
    const classification = legendProps.classification;
    const colors = legendProps.colors;
    const log = Oskari.log('Oskari.statistics.statsgrid.Classification');
    if (Object.keys(indicatorData).length === 0) {
        return { error: loc('legend.noData') };
    }
    if (!classification) {
        log.warn('Error getting indicator classification', indicatorData);
        return { error: loc('legend.noEnough') };
    }
    const opacity = props.transparency / 100 || 1;
    let legend;
    if (opacity !== 1) {
        const rgba = colors.map(color => {
            const { r, g, b } = Oskari.util.hexToRgb(color);
            return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + opacity + ')';
        });
        legend = classification.createLegend(rgba);
    } else {
        legend = classification.createLegend(colors);
    }

    if (!legend) {
        return { error: loc('legend.cannotCreateLegend') };
    } else if (legend instanceof jQuery) {
        return { __html: legend.prop('outerHTML') }; // points legend
    } else {
        return { __html: legend };
    }
};

const getNoActiveElem = text => {
    return (
        <div className="legend-noactive">
            {text}
        </div>
    );
};

const Legend = props => {
    const legendHTML = createLegendHTML(props);

    if (legendHTML.__html) {
        return (
            <div className="active-legend" dangerouslySetInnerHTML={legendHTML}/>
        );
    } else if (legendHTML.error) {
        return getNoActiveElem(legendHTML.error);
    }
    return getNoActiveElem('');
};

Legend.propTypes = {
    indicatorData: PropTypes.object.isRequired,
    transparency: PropTypes.number.isRequired,
    legendProps: PropTypes.object.isRequired,
    loc: PropTypes.func.isRequired
};

const contextWrapped = withContext(Legend);
export { contextWrapped as Legend };
