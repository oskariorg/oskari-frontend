import React from 'react';
import { showPopup } from 'oskari-ui/components/window';
import styled from 'styled-components';
import { Message, Button, TextInput, Checkbox, Select, Option, Spin } from 'oskari-ui';
import { ButtonContainer } from 'oskari-ui/components/buttons';

const BUNDLE_KEY = 'coordinatetool';

const OPTIONS = {
    id: 'coordinates'
};

const Content = styled('div')`
    margin: 12px 24px 24px;
    display: flex;
    width: 270px;
    flex-direction: column;
`;

const CoordinateFields = styled('div')`
    display: flex;
    flex-direction: column;
    margin-top: 10px;
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
    margin-left: 59px;
    margin-bottom: 10px;
`;

const CoordinateLabel = styled('div')`
    margin-right: 5px;
    width: 40px;
    display: flex;
    flex-direction: row;
`;

const SelectField = styled('div')`
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
`;

const EmergencyInfo = styled('div')`
    margin-top: 10px;
`;

const SelectLabel = styled('div')`
    font-size: 12px;
    margin-top: 5px;
    opacity: 0.8;
`;

const ReverseGeoCodes = styled('div')`
    display: flex;
    flex-direction: column;
    margin-top: 5px;
`;

const Approximation = styled('span')`
    width: 12px;
    font-size: 14px;
`;

const PopupContent = ({ state, controller, preciseTransform, supportedProjections, crsText, decimalSeparator, showReverseGeoCodeCheckbox }) => {
    let latLabel = <Message bundleKey={BUNDLE_KEY} messageKey={'display.compass.lat'} />;
    let lonLabel = <Message bundleKey={BUNDLE_KEY} messageKey={'display.compass.lon'} />;
    if (!controller.showDegrees()) {
        latLabel = <Message bundleKey={BUNDLE_KEY} messageKey={'display.compass.n'} />;
        lonLabel = <Message bundleKey={BUNDLE_KEY} messageKey={'display.compass.e'} />;
    }

    let degmin;
    let dec;
    if (controller.allowDegrees() && state?.lonField && state?.latField) {
        dec = Oskari.util.coordinateDegreesToMetric([state.lonField, state.latField], 20);
        degmin = controller.formatDegrees(dec[0], dec[1], 'min');
    }

    const content = (
        <Content>
            <Message bundleKey={BUNDLE_KEY} messageKey='display.popup.info' />
            {!preciseTransform ? (
                crsText
            ) : (
                <SelectField>
                    <SelectLabel>
                        <Message bundleKey={BUNDLE_KEY} messageKey='display.coordinatesTransform.header' />
                    </SelectLabel>
                    <Select
                        value={state.selectedProjection}
                        onChange={value => controller.setSelectedProjection(value)}
                    >
                        {supportedProjections.map(option => (
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
                    <Approximation>
                        {state.approxValue && ('~')}
                    </Approximation>
                    <TextInput
                        value={state?.latField}
                        onChange={(e) => controller.setLat(e.target.value)}
                        onBlur={() => controller.blur()}
                        disabled={state.showMouseCoordinates}
                        className='t_lat'
                    />
                </CoordinateField>
                {degmin && (
                    <DegreeContainer>
                        <span>{`${degmin.degreesY}° ${degmin.minutesY}\'`}</span>
                        <span>{`${parseFloat(dec[1]).toFixed(9).replace('.', decimalSeparator)}°`}</span>
                    </DegreeContainer>
                )}
                <CoordinateField>
                    <CoordinateLabel>{lonLabel}:</CoordinateLabel>
                    <Approximation>
                        {state.approxValue && ('~')}
                    </Approximation>
                    <TextInput
                        value={state?.lonField}
                        onChange={(e) => controller.setLon(e.target.value)}
                        onBlur={() => controller.blur()}
                        disabled={state.showMouseCoordinates}
                        className='t_lon'
                    />
                </CoordinateField>
                {degmin && (
                    <DegreeContainer>
                        <span>{`${degmin.degreesX}° ${degmin.minutesX}\'`}</span>
                        <span>{`${parseFloat(dec[0]).toFixed(9).replace('.', decimalSeparator)}°`}</span>
                    </DegreeContainer>
                )}
            </CoordinateFields>
            <Checkbox
                checked={state.showMouseCoordinates}
                onChange={() => controller.toggleMouseCoordinates()}
            >
                <Message bundleKey={BUNDLE_KEY} messageKey='display.popup.showMouseCoordinates' />
            </Checkbox>
            {showReverseGeoCodeCheckbox && (
                <Checkbox
                    checked={state.showReverseGeoCode}
                    onChange={() => controller.toggleReverseGeoCode()}
                >
                    <Message bundleKey={BUNDLE_KEY} messageKey='display.reversegeocode.moreInfo' />
                </Checkbox>
            )}
            {((showReverseGeoCodeCheckbox && state.showReverseGeoCode && state.reverseGeoCode.length > 0) || (!showReverseGeoCodeCheckbox && state.reverseGeoCode.length > 0)) && (
                <ReverseGeoCodes>
                    {state.reverseGeoCode.map((geoCode, index) => (
                        <span key={index}>{geoCode.title} <u>{geoCode.name}</u></span>
                    ))}
                </ReverseGeoCodes>
            )}
            {state.emergencyInfo && (
                <EmergencyInfo>
                    <Message bundleKey={BUNDLE_KEY} messageKey='display.coordinatesTransform.emergencyCallLabel' />
                    {` ${state.emergencyInfo.degreesY}° `}{` ${state.emergencyInfo.minutesY}\' `}
                    <Message bundleKey={BUNDLE_KEY} messageKey='display.coordinatesTransform.emergencyCallLabelAnd' />
                    {` ${state.emergencyInfo.degreesX}° `}{` ${state.emergencyInfo.minutesX}\'`}
                </EmergencyInfo>
            )}
            <ButtonContainer>
                <Button
                    type='default'
                    disabled={state.showMouseCoordinates}
                    onClick={() => controller.centerMap()}
                    className='t_center'
                >
                    <Message bundleKey={BUNDLE_KEY} messageKey='display.popup.searchButton' />
                </Button>
                {controller.markersSupported && (
                    <Button
                        type='default'
                        onClick={() => controller.setMarker()}
                        className='t_add'
                    >
                        <Message bundleKey={BUNDLE_KEY} messageKey='display.popup.addMarkerButton' />
                    </Button>
                )}
            </ButtonContainer>
        </Content>
    );

    if (state.loading) {
        return (
            <Spin>
                {content}
            </Spin>
        );
    } else {
        return content;
    }
};

export const showCoordinatePopup = (state, controller, location, supportedProjections = [], preciseTransform, crsText, decimalSeparator, showReverseGeoCodeCheckbox, onClose) => {
    const mapModule = Oskari.getSandbox().findRegisteredModuleInstance('MainMapModule');
    const options = {
        ...OPTIONS,
        placement: location,
        theme: mapModule.getMapTheme()
    }
    const controls = showPopup(
        <Message bundleKey={BUNDLE_KEY} messageKey='display.popup.title' />,
        <PopupContent
            state={state}
            controller={controller}
            preciseTransform={preciseTransform}
            supportedProjections={supportedProjections}
            crsText={crsText}
            decimalSeparator={decimalSeparator}
            showReverseGeoCodeCheckbox={showReverseGeoCodeCheckbox}
        />,
        onClose, options
    );
    return {
        ...controls,
        update: (state) => {
            controls.update(
                <Message bundleKey={BUNDLE_KEY} messageKey='display.popup.title' />,
                <PopupContent
                    state={state}
                    controller={controller}
                    preciseTransform={preciseTransform}
                    supportedProjections={supportedProjections}
                    crsText={crsText}
                    decimalSeparator={decimalSeparator}
                    showReverseGeoCodeCheckbox={showReverseGeoCodeCheckbox}
                />
            );
        }
    };
};
