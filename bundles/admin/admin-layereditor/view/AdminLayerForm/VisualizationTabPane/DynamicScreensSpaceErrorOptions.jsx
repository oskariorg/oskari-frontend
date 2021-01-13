import React, { Fragment } from 'react';
import styled from 'styled-components'
import PropTypes from 'prop-types';
import { Message, Checkbox, NumberInput } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { StyledFormField } from './styled';
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

// Descriptions from CesiumJS docs: https://cesium.com/docs/cesiumjs-ref-doc/Cesium3DTileset.html
// Not translated since technical docs:
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

const DynamicScreenSpaceError = ({ layer, controller }) => (
    <StyledDynamicScreenSpaceErrorOption>
        <Message messageKey='dynamicScreenSpaceError' />
        <StyledInputContainer>
            <Checkbox
                checked={layer.options.dynamicScreenSpaceError}
                onChange={event => 
                        controller.setOptions({
                            ...layer.options,
                            dynamicScreenSpaceError: event.target.checked
                        })
                }
            />
        </StyledInputContainer>
        <InfoTooltip message={
            <Fragment>
                <pre>{dynamicScreenSpaceErrorTemplate}</pre>
            </Fragment>
        } />
    </StyledDynamicScreenSpaceErrorOption>
);

const DynamicScreenSpaceErrorDensity = ({ layer, controller, defaultValue }) => (
    <StyledDynamicScreenSpaceErrorOption>
        <Message messageKey='dynamicScreenSpaceErrorDensity' />
        <StyledInputContainer>
            <NumberInput
                step={0.00001}
                value={layer.options.dynamicScreenSpaceErrorDensity || defaultValue}
                onChange={eventValue => 
                    controller.setOptions({
                        ...layer.options,
                        dynamicScreenSpaceErrorDensity: eventValue
                    })
                }
            />
        </StyledInputContainer>
        <InfoTooltip message={
            <Fragment>
                <pre>{dynamicScreenSpaceErrorDensityTemplate}</pre>
            </Fragment>
        } />
    </StyledDynamicScreenSpaceErrorOption>
);

const DynamicScreenSpaceErrorFactor = ({ layer, controller, defaultValue }) => (
    <StyledDynamicScreenSpaceErrorOption>
        <Message messageKey='dynamicScreenSpaceErrorFactor' />
        <StyledInputContainer>
            <NumberInput
                step={0.1}
                value={layer.options.dynamicScreenSpaceErrorFactor || defaultValue}
                onChange={eventValue =>
                    controller.setOptions({
                        ...layer.options,
                        dynamicScreenSpaceErrorFactor: eventValue
                    })
                }
            />
        </StyledInputContainer>
        <InfoTooltip message={
            <Fragment>
                <pre>{dynamicScreenSpaceErrorFactorTemplate}</pre>
            </Fragment>
        } />
    </StyledDynamicScreenSpaceErrorOption>
);

const DynamicScreenSpaceErrorHeightFalloff = ({ layer, controller, defaultValue }) => (
    <StyledDynamicScreenSpaceErrorOption>
        <Message messageKey='dynamicScreenSpaceErrorHeightFalloff' />
        <StyledInputContainer>
            <NumberInput
                step={0.01}
                value={layer.options.dynamicScreenSpaceErrorHeightFalloff || defaultValue}
                onChange={eventValue =>
                    controller.setOptions({
                        ...layer.options,
                        dynamicScreenSpaceErrorHeightFalloff: eventValue
                    })
                }
            />
        </StyledInputContainer>
        <InfoTooltip message={
            <Fragment>
                <pre>{dynamicScreenSpaceErrorHeightFalloffTemplate}</pre>
            </Fragment>
        } />
    </StyledDynamicScreenSpaceErrorOption>
);

const defaults = {
    dynamicScreenSpaceError: false,
    dynamicScreenSpaceErrorDensity: 0.00278,
    dynamicScreenSpaceErrorFactor: 4.0,
    dynamicScreenSpaceErrorHeightFalloff: 0.25
};

export const DynamicScreensPaceErrorOptions = ({ layer, controller }) => {

    const getDefaultRemovingController = (key) => {
        return {
            setOptions: (opts) => {
                if (defaults[key] === opts[key]) {
                    // setting default value -> remove it
                    delete opts[key];
                }
                controller.setOptions(opts);
            }
        };
    };
    
    const getAttributes = (fieldName) => {
        return {
            layer,
            controller: getDefaultRemovingController(fieldName),
            defaultValue: defaults[fieldName]
        }
    };

    return <StyledFormField>
                <StyledDynamicScreenSpaceErrorOptionsContainer>
                    <DynamicScreenSpaceError {...getAttributes('dynamicScreenSpaceError')}/>
                    <DynamicScreenSpaceErrorDensity {...getAttributes('dynamicScreenSpaceErrorDensity')}/>
                    <DynamicScreenSpaceErrorFactor {...getAttributes('dynamicScreenSpaceErrorFactor')}/>
                    <DynamicScreenSpaceErrorHeightFalloff {...getAttributes('dynamicScreenSpaceErrorHeightFalloff')}/>
                </StyledDynamicScreenSpaceErrorOptionsContainer>
            </StyledFormField>
};

DynamicScreensPaceErrorOptions.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
