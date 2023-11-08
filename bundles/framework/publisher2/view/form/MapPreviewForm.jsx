import React, { useEffect, useState } from 'react';

import { Radio, NumberInput } from 'oskari-ui';
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
`;

const RowContainer = styled('div')`
    display: flex;
    flex-direction: column;
`;

const Label = (props) => {
    const { option } = props;
    let text = Oskari.getMsg(MESSAGE_BUNDLE_KEY, 'BasicView.sizes.' + option.id);
    if (!isNaN(parseInt(option.width)) && !isNaN(parseInt(option.height))) {
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

    useEffect(() => {
        onChange(MAP_SIZES.find(option => option.id === selected));
    }, [selected]);

    return <RowContainer>
        <Radio.Group value={selected} onChange={(evt) => setSelected(evt.target.value)}>
            { MAP_SIZES.map((option) => {
                return <Row key={option.id}>
                    <Radio.Choice key={'radio_' + option.id} value={option.id}><Label option={option}/></Radio.Choice>
                </Row>;
            })}
        </Radio.Group>
        { selected === CUSTOM && <Row><NumberInput /> - <NumberInput/></Row>}
    </RowContainer>;
};

MapPreviewForm.propTypes = {
    options: PropTypes.array,
    onChange: PropTypes.func
};
