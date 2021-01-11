import React, { Fragment } from 'react';
import styled from 'styled-components'
import PropTypes from 'prop-types';
import { Message, Checkbox, NumberInput } from 'oskari-ui';
import { Numeric } from '../Numeric';
import { Controller } from 'oskari-ui/util';
import { StyledFormField } from './styled';
import { JsonInput } from '../JsonInput';
import { InfoTooltip } from '../InfoTooltip';


const StyledDynamicScreenSpaceErrorOptionsContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const StyledDynamicScreenSpaceErrorOption = styled.div`
    display: flex;
    align-items: center;
    height: 32px;
    margin-top: 10px;
`;

const StyledInputContainer = styled.div`
    padding-left: 10px;
`;

const dynamicScreenSpaceErrorTemplate = `Optimization option.
Reduce the screen space error
for tiles that are further
away from the camera.`;

const dynamicScreenSpaceErrorDensityTemplate = `Density used to adjust
the dynamic screen space error,
similar to fog density.`;

const dynamicScreenSpaceErrorFactorTemplate = `A factor used to increase
the computed dynamic
screen space error.`;

const dynamicScreenSpaceErrorHeightFalloffTemplate = `A ratio of the tileset's
height at which the density
starts to falloff.`;


const DynamicScreenSpaceError = ({ layer, controller }) => {
    return <StyledDynamicScreenSpaceErrorOption>
        <Message messageKey='dynamicScreenSpaceError' />
        <StyledInputContainer>
            <Checkbox
                checked={layer.options.dynamicScreenSpaceError}
                onChange={event => {
                    controller.setOptions({ ...layer.options, dynamicScreenSpaceError: event.target.checked })
                }
                } />
        </StyledInputContainer>
        <InfoTooltip message={
            <Fragment>
                <pre>{dynamicScreenSpaceErrorTemplate}</pre>
            </Fragment>
        } />
    </StyledDynamicScreenSpaceErrorOption>
};

const DynamicScreenSpaceErrorDensity = ({ layer, controller, defaultValue }) => {
    const stepValue = 0.00001;
    const value = layer.options.dynamicScreenSpaceErrorDensity === undefined ? defaultValue : layer.options.dynamicScreenSpaceErrorDensity;
    return <StyledDynamicScreenSpaceErrorOption>
        <Message messageKey='dynamicScreenSpaceErrorDensity' />
        <StyledInputContainer>
            <NumberInput
                defaultValue={defaultValue}
                step={stepValue}
                value={value}
                onChange={eventValue => {
                    controller.setOptions({ ...layer.options, dynamicScreenSpaceErrorDensity: eventValue })
                }
                }
            />
        </StyledInputContainer>

        <InfoTooltip message={
            <Fragment>
                <pre>{dynamicScreenSpaceErrorDensityTemplate}</pre>
            </Fragment>
        } />
    </StyledDynamicScreenSpaceErrorOption>
};

const DynamicScreenSpaceErrorFactor = ({ layer, controller, defaultValue }) => {
    const stepValue = 0.1;
    const value = layer.options.dynamicScreenSpaceErrorFactor === undefined ? defaultValue : layer.options.dynamicScreenSpaceErrorFactor;
    return <StyledDynamicScreenSpaceErrorOption>
        <Message messageKey='dynamicScreenSpaceErrorFactor' />
        <StyledInputContainer>
            <NumberInput
                defaultValue={defaultValue}
                step={stepValue}
                value={value}
                onChange={eventValue => controller.setOptions({ ...layer.options, dynamicScreenSpaceErrorFactor: eventValue })}
            />
        </StyledInputContainer>
        <InfoTooltip message={
            <Fragment>
                <pre>{dynamicScreenSpaceErrorFactorTemplate}</pre>
            </Fragment>
        } />
    </StyledDynamicScreenSpaceErrorOption>
};

const DynamicScreenSpaceErrorHeightFalloff = ({ layer, controller, defaultValue }) => {
    const stepValue = 0.01;
    const value = layer.options.dynamicScreenSpaceErrorHeightFalloff === undefined ? defaultValue : layer.options.dynamicScreenSpaceErrorHeightFalloff;
    return <StyledDynamicScreenSpaceErrorOption>
        <Message messageKey='dynamicScreenSpaceErrorHeightFalloff' />
        <StyledInputContainer>
            <NumberInput
                defaultValue={defaultValue}
                step={stepValue}
                value={value}
                onChange={eventValue => controller.setOptions({ ...layer.options, dynamicScreenSpaceErrorHeightFalloff: eventValue })}
            />
        </StyledInputContainer>
        <InfoTooltip message={
            <Fragment>
                <pre>{dynamicScreenSpaceErrorHeightFalloffTemplate}</pre>
            </Fragment>
        } />
    </StyledDynamicScreenSpaceErrorOption>
};

export const DynamicScreensPaceErrorOptions = ({ layer, controller }) => {

    const defaultDynamicScreenSpaceError = false;
    const defaultDynamicScreenSpaceErrorDensity = 0.00278;
    const defaultDynamicScreenSpaceErrorFactor = 4.0;
    const defaultDynamicScreenSpaceErrorHeightFalloff = 0.25;    

    // If layer options contain default values, remove them.
    layer.options.hasOwnProperty('dynamicScreenSpaceError') && layer.options.dynamicScreenSpaceError === defaultDynamicScreenSpaceError && delete layer.options['dynamicScreenSpaceError'];
    layer.options.hasOwnProperty('dynamicScreenSpaceErrorDensity') && layer.options.dynamicScreenSpaceErrorDensity === defaultDynamicScreenSpaceErrorDensity && delete layer.options['dynamicScreenSpaceErrorDensity'];
    layer.options.hasOwnProperty('dynamicScreenSpaceErrorFactor') && layer.options.dynamicScreenSpaceErrorFactor === defaultDynamicScreenSpaceErrorFactor && delete layer.options['dynamicScreenSpaceErrorFactor'];
    layer.options.hasOwnProperty('dynamicScreenSpaceErrorHeightFalloff') && layer.options.dynamicScreenSpaceErrorHeightFalloff === defaultDynamicScreenSpaceErrorHeightFalloff && delete layer.options['dynamicScreenSpaceErrorHeightFalloff'];

    return <StyledFormField>
        <StyledDynamicScreenSpaceErrorOptionsContainer>
            <DynamicScreenSpaceError layer={layer} controller={controller} defaultValue={defaultDynamicScreenSpaceError}/>
            <DynamicScreenSpaceErrorDensity layer={layer} controller={controller} defaultValue={defaultDynamicScreenSpaceErrorDensity}/>
            <DynamicScreenSpaceErrorFactor layer={layer} controller={controller} defaultValue={defaultDynamicScreenSpaceErrorFactor}/>
            <DynamicScreenSpaceErrorHeightFalloff layer={layer} controller={controller} defaultValue={defaultDynamicScreenSpaceErrorHeightFalloff}/>
        </StyledDynamicScreenSpaceErrorOptionsContainer>
    </StyledFormField>
};
DynamicScreensPaceErrorOptions.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
