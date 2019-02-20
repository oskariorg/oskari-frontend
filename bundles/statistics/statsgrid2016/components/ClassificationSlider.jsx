import React from 'react';
import {withContext} from '../../../../src/reactUtil/genericContext';

class ClassificationSlider extends React.Component {
    constructor (props) {
        super(props);
        this._rangeSlider = {
            min: 10,
            max: 120,
            step: 5
        };
    }
    componentDidMount () {
        const minRange = this.props.values.count * this._rangeSlider.step;
        this.$el = jQuery(this.el);
        this.$el.slider({
            min: this._rangeSlider.min,
            max: this._rangeSlider.max,
            step: this._rangeSlider.step,
            range: true,
            disabled: this.props.disabled,
            values: [this.props.values.min, this.props.values.max],
            slide: (event, ui) => {
                const min = ui.values[0];
                const max = ui.values[1];
                if (max - min >= minRange) {
                    return true;
                }
                return false;
            },
            stop: (event, ui) => {
                const value = {
                    min: ui.values[0],
                    max: ui.values[1]
                };
                this.props.service.getStateService().updateActiveClassificationObj(value);
            }
        });
    }
    componentWillUnmount () {
        this.$el.slider('destroy');
    }
    render () {
        const properties = this.props.properties;
        const loc = this.props.loc;

        return (
            <div className={properties.class}>
                <div className="label">{properties.label}</div>
                <div className="minmaxlabels" style={{marginBottom: '25px'}}>
                    <div className="min">{loc('classify.map.min')}</div>
                    <div className="max">{loc('classify.map.max')}</div>
                </div>
                <div className="point-range value" ref = {el => {
                    this.el = el;
                }}/>
            </div>
        );
    }
};
export default withContext(ClassificationSlider);
