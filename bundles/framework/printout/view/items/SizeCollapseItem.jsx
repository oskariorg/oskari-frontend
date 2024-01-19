import React from 'react';
import PropTypes from 'prop-types';
import { SIZE_OPTIONS } from '../../constants';
import { Message, Radio } from 'oskari-ui';
import { PanelHeader } from './PanelHeader';
import styled from 'styled-components';
import { BUNDLE_KEY } from '../PrintoutPanel';

const RadioGroup = styled(Radio.Group)`
    display: flex;
    flex-direction: column;
`;

const SizePanelContent = ({ state, controller }) => {
    return <RadioGroup
        value={state.size}
        onChange={(e) => controller.updateField('size', e.target.value)}>
        {SIZE_OPTIONS?.map(option => (
            <Radio.Choice value={option.value} key={option.value}>
                <Message bundleKey={BUNDLE_KEY} messageKey={`BasicView.size.options.${option.value}`} />
            </Radio.Choice>
        ))}
    </RadioGroup>;
};

SizePanelContent.propTypes = {
    state: PropTypes.object.isRequired,
    controller: PropTypes.object
};

export const getSizeCollapseItem = (key, state, controller) => {
    return {
        key,
        label: <PanelHeader headerMsg='BasicView.size.label' infoMsg='BasicView.size.tooltip' />,
        children: <SizePanelContent state={state} controller={controller}/>
    };
};
