import React from 'react';
import { Radio, Message, NumberInput } from 'oskari-ui';
import { InfoIcon } from 'oskari-ui/components/icons';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { CUSTOM_MAP_SIZE, CUSTOM_MAP_SIZE_LIMITS, MAP_SIZES } from '../../handler/PanelMapPreviewHandler';
import { BUNDLE_KEY } from '../../constants';

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

export const MapPreviewTooltip = () => <InfoIcon title={<Message messageKey='BasicView.size.tooltip' messageArgs={CUSTOM_MAP_SIZE_LIMITS} />}/>;

export const MapPreviewForm = ({ preview, customSize, errors, controller }) => {
    const options = MAP_SIZES.map(opt => ({ value: opt.value, label: getLabel(opt) }));
    // don't show error for initial value
    const getStatus = key => typeof customSize[key] !== 'undefined' && errors.includes(key) ? 'error' : undefined;
    return (
        <div className='t_size'>
            <RadioGroup value={preview} onChange={evt => controller.setPreview(evt.target.value)} options={options}/>
            { preview === CUSTOM_MAP_SIZE && (
                <InputContainer>
                    <SizeInput
                        placeholder={Oskari.getMsg(BUNDLE_KEY, 'BasicView.sizes.width')}
                        onChange={width => controller.setCustomSize({ ...customSize, width })}
                        status={getStatus('width')}
                        value={customSize.width}/>
                    <CustomSeparator>X</CustomSeparator>
                    <SizeInput
                        placeholder={Oskari.getMsg(BUNDLE_KEY, 'BasicView.sizes.height')}
                        status={getStatus('height')}
                        onChange={height => controller.setCustomSize({ ...customSize, height })}
                        value={customSize.height}/>
                </InputContainer>
            )}
        </div>
    );
};

MapPreviewForm.propTypes = {
    preview: PropTypes.string.isRequired,
    customSize: PropTypes.object.isRequired,
    errors: PropTypes.array.isRequired,
    controller: PropTypes.object.isRequired
};
