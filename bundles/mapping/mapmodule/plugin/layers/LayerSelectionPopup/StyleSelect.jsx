import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message, Select, Label } from 'oskari-ui';

const StyleSelection = styled('div')`
display: flex;
flex-direction: row;
align-items: center;
`;

const StyledSelect = styled(Select)`
margin-left: 10px;
`;

export const StyleSelect = ({ layer, selectStyle }) => {
    const styles = layer.getStyles();
    if (!styles.length) {
        return null;
    }
    const currentStyle = layer.getCurrentStyle() ? layer.getCurrentStyle().getName() : null;
    const options = styles.map(style => ({'value': style.getName(), 'label': style.getName(), 'data-value': style.getName()}));

    return (<StyleSelection>
        <Label><Message messageKey='plugin.LayerSelectionPlugin.style' /></Label>
        <StyledSelect
            value={currentStyle}
            onChange={(s) => selectStyle(layer.getId(), s)}
            className="t_style"
            options={options}
        />
    </StyleSelection>);
};


StyleSelect.propTypes = {
    layer: PropTypes.object.isRequired,
    selectStyle: PropTypes.func.isRequired
};
