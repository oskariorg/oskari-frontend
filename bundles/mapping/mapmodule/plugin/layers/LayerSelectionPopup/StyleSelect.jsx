import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message, Select, Option, Label } from 'oskari-ui';

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
    let currentStyle = layer.getCurrentStyle() ? layer.getCurrentStyle().getName() : null;
    return (<StyleSelection>
        <Label><Message messageKey='plugin.LayerSelectionPlugin.style' /></Label>
        <StyledSelect value={currentStyle} onChange={(s) => selectStyle(layer.getId(), s)} className="t_style">
            {styles.map(style => (
                <Option key={style.getName()} value={style.getName()}>
                    {style.getTitle()}
                </Option>
            ))}
        </StyledSelect>
    </StyleSelection>);
};


StyleSelect.propTypes = {
    layer: PropTypes.object.isRequired,
    selectStyle: PropTypes.func.isRequired
};
