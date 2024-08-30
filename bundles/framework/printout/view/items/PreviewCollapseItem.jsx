import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import { PanelHeader } from './PanelHeader';
import { BUNDLE_KEY } from '../PrintoutPanel';
import styled from 'styled-components';

const PreviewImage = styled('img')`
    margin: 8px;
    padding: 5px;
    background-color: white;
    border-bottom-color: #C0D0E0;
    border-bottom-style: solid;
    border-bottom-width: 1pt;
    border-top-color: #C0D0E0;
    border-top-style: solid;
    border-top-width: 1pt;
    box-shadow: 0 0 8px #D0D0D0;
    height: ${props => props.landscape ? '140px' : '290px'};
    width: 200px;
`;

const PreviewPanelContent = ({ state }) => {
    return <>
        <PreviewImage src={state.previewImage} landscape={state.previewImage && state.previewImage.includes('Landscape')} />
        <Message bundleKey={BUNDLE_KEY} messageKey='BasicView.preview.notes.extent' />
    </>;
};

PreviewPanelContent.propTypes = {
    state: PropTypes.object.isRequired,
    controller: PropTypes.object
};

export const getPreviewCollapseItem = (key, state) => {
    return {
        key,
        label: <PanelHeader headerMsg='BasicView.preview.label' />,
        children: <PreviewPanelContent state={state} />
    };
};
