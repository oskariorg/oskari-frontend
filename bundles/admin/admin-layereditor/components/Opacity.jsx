import React from 'react';
import PropTypes from 'prop-types';
import { Slider } from './Slider';
import { NumberInput } from './NumberInput';

export class Opacity extends React.Component {
    constructor (props) {
        super(props);
        this.state = {opacity: props.defaultValue};
        this.onChange = this.onChange.bind(this);
    }

    onChange (value) {
        this.setState({
            opacity: value
        });
        // TODO this could be handled in some better way
        this.props.onChange(value);
    }

    // Inline styles could be handled in some other way
    // Slider component had some problems if styled-components was used
    render () {
        const { opacity } = this.state;
        return (
            <div style={{width: 500}}>
                <div style={{float: 'left', width: 350, marginLeft: 10, marginRight: 10}}>
                    <Slider
                        min={0}
                        max={100}
                        onChange={this.onChange}
                        value={typeof opacity === 'number' ? opacity : 0}
                    />
                </div>
                <div style={{float: 'left', width: 120}}>
                    <NumberInput
                        min={0}
                        max={100}
                        value={opacity}
                        onChange={this.onChange}
                    /> %
                </div>
                <br style={{clear: 'left'}} />
            </div>
        );
    }
}

Opacity.propTypes = {
    defaultValue: PropTypes.number,
    onChange: PropTypes.func
};
