import React from 'react';
import PropTypes from 'prop-types';
import {withContext} from '../../../../src/react/util.jsx';
import '../resources/scss/classificationslider.scss';

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
    componentDidUpdate () {
        if (!this.$el) {
            return;
        }
        if (this.props.disabled) {
            this.$el.slider('disable');
        } else {
            this.$el.slider('enable');
        }
    }
    componentWillUnmount () {
        this.$el.slider('destroy');
    }
    render () {
        const loc = this.props.loc;
        return (
            <div className= "oskari-slider oskari-ui point-size">
                <div className="slider-label">{loc('classify.map.pointSize')}</div>
                <div className="minmaxlabels">
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
ClassificationSlider.propTypes = {
    values: PropTypes.object,
    disabled: PropTypes.bool,
    service: PropTypes.object,
    loc: PropTypes.func
};
const cls = withContext(ClassificationSlider);
export {cls as ClassificationSlider};
