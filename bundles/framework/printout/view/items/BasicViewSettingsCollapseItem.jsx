import React from 'react';
import PropTypes from 'prop-types';
import { AdditionalSettings } from './AdditionalSettings';

import { PanelHeader } from './PanelHeader';

const BasicViewPanelContent = ({ state, controller }) => {
    return <AdditionalSettings state={state} controller={controller} />;
};

BasicViewPanelContent.propTypes = {
    state: PropTypes.object.isRequired,
    controller: PropTypes.object
};

export const getBasicViewCollapseItem = (key, state, controller) => {
    return {
        key,
        label: <PanelHeader headerMsg='BasicView.settings.label' infoMsg='BasicView.settings.tooltip' />,
        children: <BasicViewPanelContent state={state} controller={controller}/>
    };
};
