import React from 'react';
import PropTypes from 'prop-types';
import { Message, Radio, TextInput, Checkbox } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import styled from 'styled-components';
import { FORMAT_OPTIONS, COORDINATE_POSITIONS, COORDINATE_PROJECTIONS } from '../../constants';
import { PanelHeader } from './PanelHeader';
import { BUNDLE_KEY } from '../PrintoutPanel';
const RadioGroup = styled(Radio.Group)`
    display: flex;
    flex-direction: column;
`;

const MapTitle = styled('div')`
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
`;

const Content = styled('div')`
    display: flex;
    flex-direction: column;
`;

const CoordinateOptions = styled('div')`
    margin-left: 24px;
`;

const StyledCheckbox = styled(Checkbox)`
    align-items: flex-start;
`;

const FormGroup = styled('div')`
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
`;

const Label = styled('div')`
    font-weight: bold;
`;

export const AdditionalSettings = ({ controller, state }) => {
    return (
        <Content>
            <FormGroup>
                <Label>
                    <Message bundleKey={BUNDLE_KEY} messageKey='BasicView.format.label' />
                </Label>
                <RadioGroup
                    value={state.format}
                    onChange={(e) => controller.updateField('format', e.target.value)}
                >
                    {FORMAT_OPTIONS?.map(option => (
                        <Radio.Choice value={option.mime} key={option.mime}>
                            <Message bundleKey={BUNDLE_KEY} messageKey={`BasicView.format.options.${option.name}`} />
                        </Radio.Choice>
                    ))}
                </RadioGroup>
            </FormGroup>
            <FormGroup>
                <MapTitle>
                    <Label>
                        <Message bundleKey={BUNDLE_KEY} messageKey='BasicView.content.label' />
                    </Label>
                    <TextInput
                        type='text'
                        placeholder={Oskari.getMsg(BUNDLE_KEY, 'BasicView.content.mapTitle.placeholder')}
                        value={state.mapTitle}
                        onChange={(e) => controller.updateField('mapTitle', e.target.value)}
                        disabled={state.format !== 'application/pdf'}
                    />
                </MapTitle>
            </FormGroup>
            <FormGroup>
                <StyledCheckbox
                    checked={state.showScale}
                    onChange={(e) => controller.updateField('showScale', e.target.checked)}
                    disabled={state.format !== 'application/pdf'}
                >
                    <Message bundleKey={BUNDLE_KEY} messageKey='BasicView.content.pageScale.label' />
                </StyledCheckbox>
                <StyledCheckbox
                    checked={state.showDate}
                    onChange={(e) => controller.updateField('showDate', e.target.checked)}
                    disabled={state.format !== 'application/pdf'}
                >
                    <Message bundleKey={BUNDLE_KEY} messageKey='BasicView.content.pageDate.label' />
                </StyledCheckbox>
                {state.isTimeSeries && (
                    <StyledCheckbox
                        checked={state.showTimeSeriesDate}
                        onChange={(e) => controller.updateField('showTimeSeriesDate', e.target.checked)}
                        disabled={state.format !== 'application/pdf'}
                    >
                        <Message bundleKey={BUNDLE_KEY} messageKey='BasicView.content.pageTimeSeriesTime.label' />
                    </StyledCheckbox>
                )}
                {/* TODO: Enable once Coordinates are implemented to back end */}
                { <StyledCheckbox
                    checked={state.showCoordinates}
                    onChange={(e) => controller.updateField('showCoordinates', e.target.checked)}
                    disabled={state.format !== 'application/pdf'}
                >
                    <Message bundleKey={BUNDLE_KEY} messageKey='BasicView.content.coordinates.label' />
                </StyledCheckbox> }
            </FormGroup>
            {state.showCoordinates && (
                <CoordinateOptions>
                    <FormGroup>
                        <Label>
                            <Message bundleKey={BUNDLE_KEY} messageKey='BasicView.content.coordinates.position.label' />
                        </Label>
                        <Radio.Group
                            value={state.coordinatePosition}
                            onChange={(e) => controller.updateField('coordinatePosition', e.target.value)}
                            disabled={state.format !== 'application/pdf'}
                        >
                            {COORDINATE_POSITIONS.map(pos => (
                                <Radio.Choice value={pos} key={pos}>
                                    <Message bundleKey={BUNDLE_KEY} messageKey={`BasicView.content.coordinates.position.options.${pos}`} />
                                </Radio.Choice>
                            ))}
                        </Radio.Group>
                    </FormGroup>
                    <FormGroup>
                        <Label>
                            <Message bundleKey={BUNDLE_KEY} messageKey='BasicView.content.coordinates.projection.label' />
                        </Label>
                        <Radio.Group
                            value={state.coordinateProjection}
                            onChange={(e) => controller.updateField('coordinateProjection', e.target.value)}
                            disabled={state.format !== 'application/pdf'}
                        >
                            {COORDINATE_PROJECTIONS.map(proj => (
                                <Radio.Choice value={proj} key={proj}>
                                    <Message bundleKey={BUNDLE_KEY} messageKey={`BasicView.content.coordinates.projection.options.${proj}`} />
                                </Radio.Choice>
                            ))}
                        </Radio.Group>
                    </FormGroup>
                </CoordinateOptions>
            )}
        </Content>
    );
};

export const getAdditionalSettingsCollapseItem = (key, state, controller) => {
    return {
        key,
        label: <PanelHeader headerMsg='BasicView.settings.label' infoMsg='BasicView.settings.tooltip' />,
        children: <AdditionalSettings state={state} controller={controller}/>
    };
};

AdditionalSettings.propTypes = {
    state: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
