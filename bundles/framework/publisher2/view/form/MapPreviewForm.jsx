import React, { useEffect, useState } from 'react';

import { Radio, TextInput } from 'oskari-ui';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const MESSAGE_BUNDLE_KEY = 'Publisher2';
const CUSTOM = 'custom';

const MAP_SIZES = [{
    id: 'fill',
    width: '',
    height: '',
    selected: true // default option
}, {
    id: 'small',
    width: 580,
    height: 387
}, {
    id: 'medium',
    width: 700,
    height: 600
}, {
    id: 'large',
    width: 1240,
    height: 700
}, {
    id: CUSTOM
}];

const SIZE_LIMITS = {
    minWidth: 30,
    minHeight: 20,
    maxWidth: 4000,
    maxHeight: 2000
};

const Row = styled('div')`
    display: flex;
    flex-direction: row;

    .ant-input.customsize {
        width: 60px!important;
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
    let text = Oskari.getMsg(MESSAGE_BUNDLE_KEY, 'BasicView.sizes.' + option.id);
    if (option.id !== CUSTOM && !isNaN(parseInt(option.width)) && !isNaN(parseInt(option.height))) {
        text += ' (' + option.width + ' x ' + option.height + 'px)';
    }
    return <div>{text}</div>;
};

Label.propTypes = {
    option: PropTypes.any
};

export const MapPreviewForm = (props) => {
    const { onChange } = props;
    const [selected, setSelected] = useState(MAP_SIZES.find(option => option.selected).id);
    const [customWidth, setCustomWidth] = useState(null);
    const [customHeight, setCustomHeight] = useState(null);
    const [errors, setErrors] = useState({});

    const isValidWidth = (width) => {
        return selected !== CUSTOM || (width >= SIZE_LIMITS.minWidth && width <= SIZE_LIMITS.maxWidth);
    };

    const isValidHeight = (height) => {
        return selected !== CUSTOM || (height >= SIZE_LIMITS.minHeight && height <= SIZE_LIMITS.maxHeight);
    };

    const widthChanged = (value) => {
        if (!isValidWidth(value)) {
            setErrors({ ...errors, width: true });
            return;
        }

        setErrors({ ...errors, width: false });
        setCustomWidth(value);
    };

    const heightChanged = (value) => {
        if (!isValidHeight(value)) {
            setErrors({ ...errors, height: true });
            return;
        }

        setErrors({ ...errors, height: false });
        setCustomHeight(value);
    };

    useEffect(() => {
        const selectedOption = MAP_SIZES.find(option => option.id === selected);
        let valid = true;
        if (selected === CUSTOM) {
            valid = isValidWidth(customWidth) && isValidHeight(customHeight);
            selectedOption.width = customWidth;
            selectedOption.height = customHeight;
        }

        if (valid) {
            onChange(selectedOption);
        }
    }, [selected, customWidth, customHeight]);

    return <RowContainer>
        <Radio.Group value={selected} onChange={(evt) => setSelected(evt.target.value)}>
            { MAP_SIZES.map((option) => {
                return <Row key={option.id}>
                    <Radio.Choice key={'radio_' + option.id} value={option.id}><Label option={option}/></Radio.Choice>
                </Row>;
            })}
        </Radio.Group>
        {
            <Row>
                <TextInput disabled={selected !== CUSTOM} className={errors?.width ? 'customsize error' : 'customsize'} onChange={((evt) => { widthChanged(evt.currentTarget.value); })}/>
                <CustomSeparator>X</CustomSeparator>
                <TextInput disabled={selected !== CUSTOM} className={errors?.height ? 'customsize error' : 'customsize'} onChange={((evt) => { heightChanged(evt.currentTarget.value); })}/>
            </Row>
        }
    </RowContainer>;
};

MapPreviewForm.propTypes = {
    options: PropTypes.array,
    onChange: PropTypes.func
};
