import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Slider } from './Slider';
import { NumberInput } from './NumberInput';

const StyledRoot = styled('div')`
    width: 500px;
`;

const StyledSlider = styled('div')`
    width: 350px;
    float: left;
    margin-left: 10px;
    margin-right: 10px;
`;

const StyledNumberInput = styled('div')`
    width: 120px;
    float: left;
`;

const StyledClear = styled('br')`
    clear: left;
`;

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

    render () {
        const { opacity } = this.state;
        return (
            <StyledRoot>
                <StyledSlider>
                    <Slider
                        min={0}
                        max={100}
                        onChange={this.onChange}
                        value={typeof opacity === 'number' ? opacity : 0}
                    />
                </StyledSlider>
                <StyledNumberInput>
                    <NumberInput
                        min={0}
                        max={100}
                        value={opacity}
                        onChange={this.onChange}
                    /> %
                </StyledNumberInput>
                <StyledClear />
            </StyledRoot>
        );
    }
}

Opacity.propTypes = {
    defaultValue: PropTypes.number,
    onChange: PropTypes.func
};
