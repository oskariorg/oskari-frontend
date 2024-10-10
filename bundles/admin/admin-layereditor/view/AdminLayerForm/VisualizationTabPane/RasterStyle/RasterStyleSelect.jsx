import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message, Option } from 'oskari-ui';
import { LocaleConsumer, Controller } from 'oskari-ui/util';
import { IconButton } from 'oskari-ui/components/buttons';
import { DefaultStyle, StyleField, StyleSelect, StyledFormField } from '../styled';
import { GLOBAL_LEGEND } from './helper';

const UnavailableWrapper = styled.div`
    display: flex;
    & button {
        margin-left: 1em;
    }
`;

const RasterStyleSelect = ({ selected, styles, defaultName, setSelected, controller, getMessage }) => {
    const isDefaultStyle = name => name === defaultName;
    const getStyleLabel = style => {
        const { name, title } = style;
        const label = title || name;
        if (isDefaultStyle(name)) {
            return label + ' (' + getMessage('styles.default') + ')';
        }
        return label;
    };
    const onDefaultStyleChange = (name, isSelected) => {
        const defaultStyle = isSelected ? name : '';
        controller.setStyle(defaultStyle);
    };

    let showUnavailable = false;
    if (styles.length === 0) {
        showUnavailable = true;
    } else if (styles.length === 1 && styles[0].name === GLOBAL_LEGEND) {
        showUnavailable = true;
    }
    if (showUnavailable) {
        return (
            <StyledFormField>
                <UnavailableWrapper>
                    <Message messageKey='styles.raster.unavailable'/>
                    { defaultName &&
                        <IconButton type='delete'
                            onClick={() => onDefaultStyleChange(defaultName, false)}
                            title={<Message messageKey='styles.raster.removeDefault' />}
                        />
                    }
                </UnavailableWrapper>
            </StyledFormField>
        );
    }
    return (
        <StyleField>
            <StyleSelect
                value={selected}
                onChange={setSelected}
            >
                { styles.map(style => (
                    <Option key={style.name} value={style.name}>
                        {getStyleLabel(style)}
                    </Option>
                )) }
            </StyleSelect>
            <DefaultStyle
                checked={isDefaultStyle(selected)}
                onClick={evt => onDefaultStyleChange(selected, evt.target.checked)}
            >
                <Message messageKey='styles.default'/>
            </DefaultStyle>
        </StyleField>
    );
};
RasterStyleSelect.propTypes = {
    selected: PropTypes.string.isRequired,
    styles: PropTypes.array.isRequired,
    defaultName: PropTypes.string,
    setSelected: PropTypes.func.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
    getMessage: PropTypes.func.isRequired
};

const contextWrap = LocaleConsumer(RasterStyleSelect);
export { contextWrap as RasterStyleSelect };
