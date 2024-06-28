import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Slider } from './Slider';
import { NumberInput } from './NumberInput';

const StyledSlider = styled('div')`
    width: 100%;
    padding: 0 10px 0 5px;
    float: left;
    .ant-slider-track {
        background-color: #0091ff;
    }
    &:hover .ant-slider-track {
        background-color: #003fc3 !important;
    }
    ${props => props.bordered && (
        `
            border-radius: 4px 0 0 4px;
            border: 1px solid #d9d9d9;
        `
    )}
`;

const Container = styled('div')`
    width: 100%;
    display: flex;
    flex-direction: row;
`;

const NumberInputContainer = styled('div')`
    display: flex;
    flex-direction: row;
`;

const NumberSuffix = styled('span')`
    margin: 0;
    padding-top: 5px;
`;

const StyledNumberInput = styled(NumberInput)`
    width: 65px;
    margin: 0 5px 0 -1px;
`;

const StyledClear = styled('br')`
    clear: left;
`;

export class Opacity extends React.Component {
    constructor (props) {
        super(props);
        this.state = { opacity: props.defaultValue };
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
            <Container>
                {!this.props.inputOnly && (
                    <StyledSlider bordered={this.props.bordered}>
                        <Slider
                            min={0}
                            max={100}
                            onChange={this.onChange}
                            value={typeof opacity === 'number' ? opacity : 0}
                        />
                    </StyledSlider>
                )}
                <NumberInputContainer>
                    <StyledNumberInput
                        min={0}
                        max={100}
                        value={opacity}
                        onChange={this.onChange}
                    />
                    <NumberSuffix>
                        %
                    </NumberSuffix>
                </NumberInputContainer>
                <StyledClear />
            </Container>
        );
    }
}

Opacity.propTypes = {
    defaultValue: PropTypes.number,
    onChange: PropTypes.func,
    bordered: PropTypes.bool,
    inputOnly: PropTypes.bool
};
