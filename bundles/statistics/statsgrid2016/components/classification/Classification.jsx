import React from 'react';
import PropTypes from 'prop-types';
import {withContext, handleBinder} from '../../../../../src/react/util.jsx';
import {EditClassification} from './editclassification/EditClassification';
import {Legend} from './Legend';
import {Header} from './Header';
import './classification.scss';

class Classification extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            isEdit: props.isEdit
        };
        handleBinder(this, 'handle');
        this.log = Oskari.log('Oskari.statistics.statsgrid.Classification');
    }
    componentDidMount () {
        this.props.onRenderChange();
    }
    componentDidUpdate () {
        this.props.onRenderChange(true, this.state.isEdit);
    }
    handleToggleClassification () {
        this.setState(oldState => ({ isEdit: !oldState.isEdit }));
    }

    createLegendHTML () {
        const {loc, legendProps} = this.props;
        const indicatorData = this.props.indicators.data;
        const classification = legendProps.classification;
        const colors = legendProps.colors;
        if (Object.keys(indicatorData).length === 0) {
            return {error: loc('legend.noData')};
        }
        if (!classification) {
            this.log.warn('Error getting indicator classification', indicatorData);
            return {error: loc('legend.noEnough')};
        }
        const opacity = this.props.classifications.values.transparency / 100 || 1;
        let legend;
        if (opacity !== 1) {
            const rgba = colors.map(color => {
                const {r, g, b} = Oskari.util.hexToRgb(color);
                return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + opacity + ')';
            });
            legend = classification.createLegend(rgba);
        } else {
            legend = classification.createLegend(colors);
        }

        if (!legend) {
            return {error: loc('legend.cannotCreateLegend')};
        } else if (legend instanceof jQuery) {
            return {__html: legend.prop('outerHTML')}; // points legend
        } else {
            return {__html: legend};
        }
    }

    render () {
        const classifications = this.props.classifications;
        const activeIndicator = this.props.indicators.active;
        const legendHTML = this.createLegendHTML();

        return (
            <div className="statsgrid-classification-container">
                <Header active = {activeIndicator} isEdit = {this.state.isEdit}
                    handleClick = {this.handleToggleClassification}
                    indicators = {this.props.indicators.selected}/>
                <EditClassification
                    classifications = {classifications}
                    isEdit = {this.state.isEdit}
                    indicators = {this.props.indicators}/>
                <Legend indicator = {activeIndicator} legendHTML = {legendHTML}/>
            </div>
        );
    }
}

Classification.propTypes = {
    indicators: PropTypes.object,
    classifications: PropTypes.object,
    state: PropTypes.object,
    isEdit: PropTypes.bool,
    legendProps: PropTypes.object,
    onRenderChange: PropTypes.func,
    service: PropTypes.object,
    loc: PropTypes.func
};

const cls = withContext(Classification);
export {cls as Classification};
