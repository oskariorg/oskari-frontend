import React, { useEffect, useState } from 'react';
import { Radio, TextInput, Message } from 'oskari-ui';
import { Info } from 'oskari-ui/components/icons/Info';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { CUSTOM_MAP_SIZE_ID, CUSTOM_MAP_SIZE_LIMITS } from '../../handler/PanelMapPreviewHandler';
import { PUBLISHER_BUNDLE_ID } from '../PublisherSideBarHandler';

const Row = styled('div')`
    margin-top: 0.5em;
    display: flex;
    flex-direction: row;

    .ant-input.customsize {
        width: 80px;
    }
    input.error {
        border: 1px solid red;
    }
`;

const CustomSeparator = styled('div')`
    margin: auto 0.5em;
`;

const RowContainer = styled('div')`
    display: flex;
    flex-direction: column;
`;

const Label = (props) => {
    const { option } = props;
    let extraInfo = '';
    if (option.id !== CUSTOM_MAP_SIZE_ID && !isNaN(parseInt(option.width)) && !isNaN(parseInt(option.height))) {
        extraInfo = '(' + option.width + ' x ' + option.height + 'px)';
    }
    return <Message messageKey={ 'BasicView.sizes.' + option.id}>{ extraInfo }</Message>;
};

Label.propTypes = {
    option: PropTypes.any
};

export const MapPreviewTooltip = () => <Info title={<Message messageKey='BasicView.size.tooltip' messageArgs={CUSTOM_MAP_SIZE_LIMITS} />}/>;

export const MapPreviewForm = (props) => {
    const { onChange, mapSizeOptions, initialSelection } = props;
    const [selected, setSelected] = useState(initialSelection?.id || mapSizeOptions.find(option => option.selected).id);
    const [customWidth, setCustomWidth] = useState(initialSelection?.width ? initialSelection?.width : null);
    const [customHeight, setCustomHeight] = useState(initialSelection?.height ? initialSelection?.height : null);
    const [errors, setErrors] = useState({});

    const isValidWidth = (width) => {
        return selected !== CUSTOM_MAP_SIZE_ID || (width >= CUSTOM_MAP_SIZE_LIMITS.minWidth && width <= CUSTOM_MAP_SIZE_LIMITS.maxWidth);
    };

    const isValidHeight = (height) => {
        return selected !== CUSTOM_MAP_SIZE_ID || (height >= CUSTOM_MAP_SIZE_LIMITS.minHeight && height <= CUSTOM_MAP_SIZE_LIMITS.maxHeight);
    };

    const widthChanged = (value) => {
        setErrors({ ...errors, width: !isValidWidth(value) });
        setCustomWidth(value);
    };

    const heightChanged = (value) => {
        setErrors({ ...errors, height: !isValidHeight(value) });
        setCustomHeight(value);
    };

    useEffect(() => {
        const selectedOption = mapSizeOptions.find(option => option.id === selected);
        let valid = true;
        if (selected === CUSTOM_MAP_SIZE_ID) {
            valid = isValidWidth(customWidth) && isValidHeight(customHeight);
            selectedOption.width = customWidth;
            selectedOption.height = customHeight;
        }
        selectedOption.valid = valid;
        onChange(selectedOption);
    }, [selected, customWidth, customHeight]);

    const customInputDisabled = selected !== CUSTOM_MAP_SIZE_ID;
    return <RowContainer>
        <Radio.Group value={selected} onChange={(evt) => setSelected(evt.target.value)}>
            { mapSizeOptions.map((option) => {
                return <Row key={option.id}>
                    <Radio.Choice key={'radio_' + option.id} value={option.id}><Label option={option}/></Radio.Choice>
                </Row>;
            })}
        </Radio.Group>
        {
            <Row>
                <TextInput
                    placeholder={Oskari.getMsg(PUBLISHER_BUNDLE_ID, 'BasicView.sizes.width')}
                    disabled={customInputDisabled}
                    className={!customInputDisabled && errors?.width ? 'customsize error' : 'customsize'}
                    onChange={((evt) => { widthChanged(evt.currentTarget.value); })}
                    value={customWidth}/>
                <CustomSeparator>X</CustomSeparator>
                <TextInput
                    placeholder={Oskari.getMsg(PUBLISHER_BUNDLE_ID, 'BasicView.sizes.height')}
                    disabled={customInputDisabled}
                    className={!customInputDisabled && errors?.height ? 'customsize error' : 'customsize'}
                    onChange={((evt) => { heightChanged(evt.currentTarget.value); })}
                    value={customHeight}/>
            </Row>
        }
    </RowContainer>;
};

MapPreviewForm.propTypes = {
    mapSizeOptions: PropTypes.array,
    initialSelection: PropTypes.object,
    onChange: PropTypes.func
};
