import React from 'react';
import PropTypes from 'prop-types';
import {withContext, handleBinder} from '../../../../src/react/util.jsx';
import {ClassificationEdit} from './ClassificationEdit';
import {ActiveLegend} from './ActiveLegend';
import '../resources/scss/classification.scss';

class Classification extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            isEdit: props.isEdit
        };
        handleBinder(this);
        this.log = Oskari.log('Oskari.statistics.statsgrid.Classification');
    }
    componentDidMount () {
        this.props.onRenderChange();
    }
    componentDidUpdate () {
        this.props.onRenderChange(true, this.state.isEdit);
    }

    handleIndicatorChange (event) {
        const service = this.props.service.getStateService();
        service.setActiveIndicator(event.target.value);
    }
    handleToggleClassification (event) {
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

    getHeaderComponent () {
        const indicators = this.props.indicators.selected;
        const active = this.props.indicators.active;
        if (indicators.length === 1) {
            return (
                <div className = "title">{indicators[0].title}</div>
            );
        }
        return (
            <select value={active.hash} onChange={this.handleIndicatorChange}>
                {indicators.map(opt => <option key={opt.id} value={opt.id}>{opt.title}</option>)}
            </select>
        );
    }
    getEditButton () {
        if (this.state.isEdit) {
            return (
                <div className="edit-button edit-active" title={this.props.loc('classify.edit.close')} onMouseUp = {this.handleToggleClassification}/>
            );
        }
        return (
            <div className="edit-button" title={this.props.loc('classify.edit.open')} onMouseUp = {this.handleToggleClassification}/>
        );
    }

    render () {
        const classifications = this.props.classifications;
        const activeIndicator = this.props.indicators.active;
        const indicators = this.props.indicators.selected;
        const headerClass = indicators.length === 1 ? 'active-header single-selected' : 'active-header multi-selected';
        const {title} = indicators.find(indicator => activeIndicator.hash === indicator.id) || {title: ''};
        const legendHTML = this.createLegendHTML();

        return (
            <div className="statsgrid-classification-container">
                <div className={headerClass} data-selected-indicator={title}>
                    {this.getHeaderComponent()}
                    {this.getEditButton()}
                </div>
                <ClassificationEdit
                    classifications = {classifications}
                    isEdit = {this.state.isEdit}
                    indicators = {this.props.indicators}/>
                <ActiveLegend indicator = {activeIndicator} legendHTML = {legendHTML}/>
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
