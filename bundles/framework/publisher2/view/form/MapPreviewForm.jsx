import React from 'react';
import { Radio, Message, NumberInput } from 'oskari-ui';
import { Info } from 'oskari-ui/components/icons/Info';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { CUSTOM_MAP_SIZE, CUSTOM_MAP_SIZE_LIMITS, MAP_SIZES } from '../../handler/PanelMapPreviewHandler';
import { PUBLISHER_BUNDLE_ID } from '../PublisherSideBarHandler';

const InputContainer = styled('div')`
    margin-top: 0.5em;
    display: flex;
    flex-direction: row;
`;

const SizeInput = styled(NumberInput)`
    width: 80px;
`;

const CustomSeparator = styled('div')`
    margin: auto 0.5em;
`;

const RadioGroup = styled(Radio.Group)`
    display: flex;
    flex-direction: column;
`;

const getLabel = ({ value, width, height }) => <Message messageKey={`BasicView.sizes.${value}`}>{ width && height ? `(${width} x ${height})` : '' }</Message>;

export const MapPreviewTooltip = () => <Info title={<Message messageKey='BasicView.size.tooltip' messageArgs={CUSTOM_MAP_SIZE_LIMITS} />}/>;

export const MapPreviewForm = ({ state, controller }) => {
    const { preview, customSize, errors } = state;
    const options = MAP_SIZES.map(opt => ({ value: opt.value, label: getLabel(opt) }));
    // don't show error for initial value
    const getStatus = key => typeof customSize[key] !== 'undefined' && errors.includes(key) ? 'error' : undefined;
    return (
        <div>
            <RadioGroup value={preview} onChange={evt => controller.setPreview(evt.target.value)} options={options}/>
            { preview === CUSTOM_MAP_SIZE && (
                <InputContainer>
                    <SizeInput
                        placeholder={Oskari.getMsg(PUBLISHER_BUNDLE_ID, 'BasicView.sizes.width')}
                        onChange={width => controller.setCustomSize({ ...customSize, width })}
                        status={getStatus('width')}
                        value={customSize.width}/>
                    <CustomSeparator>X</CustomSeparator>
                    <SizeInput
                        placeholder={Oskari.getMsg(PUBLISHER_BUNDLE_ID, 'BasicView.sizes.height')}
                        status={getStatus('height')}
                        onChange={height => controller.setCustomSize({ ...customSize, height })}
                        value={customSize.height}/>
                </InputContainer>
            )}
        </div>
    );
};

MapPreviewForm.propTypes = {
    state: PropTypes.object.isRequired,
    controller: PropTypes.object.isRequired
};
