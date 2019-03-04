import React from 'react';
import ReactDOM from 'react-dom';
import ClassificationEdit from './ClassificationEdit';
import ActiveLegend from './ActiveLegend';
import {withContext} from '../../../../src/reactUtil/genericContext';
import handleBinder from '../../../../src/reactUtil/handleBinder';
import '../resources/scss/classification.scss';

class Classification extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            isEdit: false
        };
        this.legendHTML = {};
        handleBinder(this);
    }
    componentDidMount () {
        this.props.plugin.trigger('Rendered');
    }
    componentDidUpdate () {
        this.props.plugin.trigger('Updated', this.state.isEdit);
    }

    handleIndicatorChange (event) {
        const service = this.props.service.getStateService();
        service.setActiveIndicator(event.target.value);
    }
    handleToggleClassification (event) {
        this.setState(oldState => ({ isEdit: !oldState.isEdit }));
    }

    getLegend () {
        const {loc, service, plugin} = this.props;        
        const indicatorData = this.props.indicators.data;
        const currentRegionset = this.props.indicators.regionset;
        if (indicatorData && Object.keys(indicatorData).length !== 0) {
            this.createLegendHTML(indicatorData);
            return;
        }
        const active = this.props.indicators.active;
        // TODO do we need to try to get indicator data if it's not coming from props
        service.getIndicatorData(active.datasource, active.indicator,
            active.selections, active.series, currentRegionset, (err, data) => {
                if (err) {
                    plugin.log.warn('Error getting indicator classification', active, currentRegionset);
                    this.legendHTML = {error: loc('legend.noData')};
                    return;
                }
                if (!data) {
                    plugin.log.warn('Error getting indicator data', data);
                    this.legendHTML = {error: loc('legend.noData')};
                    return;
                }
                this.createLegendHTML(data);
            });
    }

    createLegendHTML (data) {
        const {loc, service, plugin} = this.props;
        const classificationOpts = this.props.classifications.values;
        const indHash = this.props.indicators.active.hash;
        const groupStats = this.props.indicators.serieStats || service.getSeriesService().getSeriesStats(indHash);
        const classification = service.getClassificationService().getClassification(data, classificationOpts, groupStats);
        if (!classification) {
            plugin.log.warn('Error getting indicator classification', data);
            this.legendHTML = {error: loc('legend.noEnough')};
            return;
        }
        if (classificationOpts.count !== classification.getGroups().length) {
            // classification count changed!!
            service.getStateService().updateActiveClassification('count', classification.getGroups().length);
            this.legendHTML = {error: loc('legend.noEnough')};
            return;
        }

        const colors = service.getColorService().getColorsForClassification(classificationOpts, true);
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
            this.legendHTML = {error: loc('legend.cannotCreateLegend')};
        } else if (legend instanceof jQuery) {
            this.legendHTML = {__html: legend.prop('outerHTML')}; // points legend
        } else {
            this.legendHTML = {__html: legend};
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
            <select value={active.hash} style={{ width: '94%', padding: '2px' }} onChange={this.handleIndicatorChange}>
                {indicators.map(opt => <option key={opt.id} value={opt.id}>{opt.title}</option>)}
            </select>
        );
    }
    getEditButton () {
        if (this.state.isEdit) {
            return <div className="edit-button edit-active" title={this.props.loc('classify.edit.close')} onMouseUp = {this.handleToggleClassification}/>
        }
        return <div className="edit-button" title={this.props.loc('classify.edit.open')} onMouseUp = {this.handleToggleClassification}/>
    }

    render () {
        const classifications = this.props.classifications;
        const activeIndicator = this.props.indicators.active;
        const indicators = this.props.indicators.selected;
        const headerClass = indicators.length === 1 ? 'active-header single-selected' : 'active-header multi-selected';
        const {title} = indicators.find(indicator => activeIndicator.hash === indicator.id) || {title: ''};
        this.getLegend();

        return (
            <div className="statsgrid-classification-container" onMouseUp = {() => this.props.plugin.trigger('ContainerClicked')}>
                <div className={headerClass} data-selected-indicator={title}>
                    {this.getHeaderComponent()}
                    {this.getEditButton()}
                </div>
                <ClassificationEdit
                    classifications = {classifications}
                    isEdit = {this.state.isEdit}
                    indicators = {this.props.indicators}/>
                <ActiveLegend indicator = {activeIndicator} legendHTML = {this.legendHTML}/>
            </div>
        );
    }
}
export default withContext(Classification);
