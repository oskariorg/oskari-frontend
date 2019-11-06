import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ColAuto } from './Grid';
import { Icon, Select, Option, InputGroup, Button } from 'oskari-ui';
import { THEME_COLOR } from '.';

const StyledSelect = styled(Select)`
    width: 120px;
`;
const Label = styled('div')`
    width: 40px;
    text-align: right;
`;

const handleOwnStyleClick = ownStyleCallback => {
    if (typeof ownStyleCallback === 'function') {
        ownStyleCallback();
    }
};

const getOption = (style, ...rest) => (
    <Option key={style.getName()} value={style.getName()} {...rest}>
        {style.getTitle()}
    </Option>
);

export const StyleSettings = ({ layer, locale, onChange }) => {
    const styles = layer.getStyles();
    const styleTool = layer.getTool('ownStyle');
    const currentStyle = layer.getCurrentStyle();
    if (styles.length < 2 && !styleTool) {
        return null;
    }
    return (
        <ColAuto>
            <Label>{ locale.layer.styles.title }</Label>
            <InputGroup compact>
                <StyledSelect
                    value={currentStyle.getName()}
                    disabled={styles.length < 2}
                    onChange={onChange}
                >
                    { styles.length < 2 &&
                        getOption(currentStyle)
                    }
                    { styles.length >= 2 &&
                        styles.map(getOption)
                    }
                </StyledSelect>
                { styleTool &&
                    <Button style={{ paddingLeft: '5px', paddingRight: '5px' }}
                        onClick={() => handleOwnStyleClick(styleTool.getCallback())}>
                        <Icon type="edit" style={{ color: THEME_COLOR, fontSize: '16px' }}/>
                    </Button>
                }
            </InputGroup>
        </ColAuto>
    );
};
StyleSettings.propTypes = {
    layer: PropTypes.object.isRequired,
    locale: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
};
