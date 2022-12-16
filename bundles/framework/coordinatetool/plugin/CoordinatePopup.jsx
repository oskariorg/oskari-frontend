import React from 'react';
import { showPopup } from 'oskari-ui/components/window';
import styled from 'styled-components';
import { Message, Button, TextInput, Checkbox, Select, Option } from 'oskari-ui';
import { ButtonContainer } from 'oskari-ui/components/buttons';

const BUNDLE_KEY = 'coordinatetool';

const OPTIONS = {
    id: 'coordinates'
};

const Content = styled('div')`
    margin: 12px 24px 24px;
    display: flex;
    flex-direction: column;
`;

const CoordinateFields = styled('div')`
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    margin-bottom: 10px;
`;

const CoordinateField = styled('div')`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 10px;
`;

const DegreeContainer = styled('div')`
    display: flex;
    flex-direction: column;
    margin-left: 45px;
    margin-bottom: 10px;
`;

const CoordinateLabel = styled('div')`
    margin-right: 5px;
    width: 40px;
    display: flex;
    flex-direction: row;
`;

const SelectField = styled('div')`
    margin-top: 10px;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
`;

const PopupContent = ({ state, controller }) => {
    let latLabel = <Message bundleKey={BUNDLE_KEY} messageKey={'display.compass.lat'} />;
    let lonLabel = <Message bundleKey={BUNDLE_KEY} messageKey={'display.compass.lon'} />;
    if (!controller.showDegrees()) {
        latLabel = <Message bundleKey={BUNDLE_KEY} messageKey={'display.compass.n'} />;
        lonLabel = <Message bundleKey={BUNDLE_KEY} messageKey={'display.compass.e'} />;
    }

    let degmin;
    let dec;
    if (controller.allowDegrees() && state?.xy?.lonlat?.lon && state?.xy?.lonlat?.lat) {
        dec = Oskari.util.coordinateDegreesToMetric([state.xy.lonlat.lon, state.xy.lonlat.lat], 20);
        degmin = controller.formatDegrees(dec[0], dec[1], 'min');
    }

    return (
        <Content>
            <Message bundleKey={BUNDLE_KEY} messageKey='display.popup.info' />
            <br />
            {!controller.getPreciseTransform() ? (
                controller.getCrsText()
            ) : (
                <SelectField>
                    <Message bundleKey={BUNDLE_KEY} messageKey='display.coordinatesTransform.header' />
                    <Select
                        value={state.selectedProjection}
                        onChange={value => controller.setSelectedProjection(value)}
                    >
                        {controller.getSupportedProjections()?.map(option => (
                            <Option key={option} value={option}>
                                <Message bundleKey={BUNDLE_KEY} messageKey={`display.coordinatesTransform.projections.${option}`} />
                            </Option>
                        )) }
                    </Select>
                </SelectField>
            )}
            <CoordinateFields>
                <CoordinateField>
                    <CoordinateLabel>{latLabel}:</CoordinateLabel>
                    <TextInput
                        value={state?.xy?.lonlat?.lat}
                        onChange={(e) => controller.setLat(e.target.value)}
                        disabled={state.showMouseCoordinates}
                    />
                </CoordinateField>
                {degmin && (
                    <DegreeContainer>
                        <span>{`${degmin.degreesY}° ${degmin.minutesY}\'`}</span>
                        <span>{`${parseFloat(dec[1]).toFixed(9).replace('.', controller.getDecimalSeparator)}°`}</span>
                    </DegreeContainer>
                )}
                <CoordinateField>
                    <CoordinateLabel>{lonLabel}:</CoordinateLabel>
                    <TextInput
                        value={state?.xy?.lonlat?.lon}
                        onChange={(e) => controller.setLon(e.target.value)}
                        disabled={state.showMouseCoordinates}
                    />
                </CoordinateField>
                {degmin && (
                    <DegreeContainer>
                        <span>{`${degmin.degreesX}° ${degmin.minutesX}\'`}</span>
                        <span>{`${parseFloat(dec[0]).toFixed(9).replace('.', controller.getDecimalSeparator)}°`}</span>
                    </DegreeContainer>
                )}
            </CoordinateFields>
            <Checkbox
                checked={state.showMouseCoordinates}
                onChange={() => controller.toggleMouseCoordinates()}
            >
                <Message bundleKey={BUNDLE_KEY} messageKey='display.popup.showMouseCoordinates' />
            </Checkbox>
            {state.emergencyInfo && (
                <div>
                    <Message bundleKey={BUNDLE_KEY} messageKey='display.coordinatesTransform.emergencyCallLabel' />
                    {` ${state.emergencyInfo.degreesY}° `}{` ${state.emergencyInfo.minutesY}\' `}
                    <Message bundleKey={BUNDLE_KEY} messageKey='display.coordinatesTransform.emergencyCallLabelAnd' />
                    {` ${state.emergencyInfo.degreesX}° `}{` ${state.emergencyInfo.minutesX}\'`}
                </div>
            )}
            <ButtonContainer>
                <Button
                    type='default'
                    disabled={state.showMouseCoordinates}
                    onClick={() => controller.centerMap()}
                >
                    <Message bundleKey={BUNDLE_KEY} messageKey='display.popup.searchButton' />
                </Button>
                {controller.markersSupported && (
                    <Button
                        type='default'
                        onClick={() => controller.setMarker()}
                    >
                        <Message bundleKey={BUNDLE_KEY} messageKey='display.popup.addMarkerButton' />
                    </Button>
                )}
            </ButtonContainer>
        </Content>
    );
};

export const showCoordinatePopup = (state, controller, onClose) => {
    const controls = showPopup(<Message bundleKey={BUNDLE_KEY} messageKey='display.popup.title' />, <PopupContent state={state} controller={controller} />, onClose, OPTIONS);
    return {
        ...controls,
        update: (state) => {
            controls.update(<Message bundleKey={BUNDLE_KEY} messageKey='display.popup.title' />, <PopupContent state={state} controller={controller} />);
        }
    };
};
