import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Tabs, Message, Spin } from 'oskari-ui';
import { BasicInfoTabPane, InspireTabPane, JHSTabPane, QualityTabPane, ActionsTabPane } from './tab';

const ContainerDiv = styled.div`
    margin: 1em;
    min-width: 20vw;
    max-width: ${props => props.isMobile ? '100' : 75}vw;
`;
const Spinner = styled(Spin)`
    margin: 100px 200px;
`;

export const MetadataContainer = ({
    activeTab,
    loading,
    metadata,
    identifications,
    layers,
    showFullGraphics,
    hideMetadataXMLLink,
    controller
}) => {
    if (loading) {
        return <Spinner/>;
    }
    if (!identifications.length) {
        return (
            <ContainerDiv>
                <Message messageKey='flyout.error.notFound' />
            </ContainerDiv>
        );
    }
    // TODO: should we support multiple identifications => render accordion || select || tabs??
    const identification = identifications[0];
    const hideLink = hideMetadataXMLLink || !metadata.metadataURL;
    const skipActions = Oskari.dom.isEmbedded() || (hideLink && layers.length === 0);

    const items = [
        {
            key: 'basic',
            label: <Message messageKey='flyout.tab.basic'/>,
            children: <BasicInfoTabPane metadata={metadata} identification={identification} controller={controller} showFullGraphics={showFullGraphics}/>
        }, {
            key: 'jhs',
            label: <Message messageKey='flyout.tab.jhs'/>,
            children: <JHSTabPane metadata={metadata} identification={identification} controller={controller} showFullGraphics={showFullGraphics}/>
        }, {
            key: 'inspire',
            label: <Message messageKey='flyout.tab.inspire'/>,
            children: <InspireTabPane metadata={metadata} identification={identification} controller={controller} showFullGraphics={showFullGraphics}/>
        }, {
            key: 'quality',
            label: <Message messageKey='flyout.tab.quality'/>,
            children: <QualityTabPane metadata={metadata} />
        }, {
            key: 'actions',
            label: <Message messageKey='flyout.tab.actions'/>,
            children: <ActionsTabPane metadataURL={metadata.metadataURL} layers={layers} hideLink={hideLink} controller={controller}/>
        }
    ];
    return (
        <ContainerDiv isMobile={Oskari.util.isMobile()}>
            <Tabs
                activeKey = { activeTab }
                onChange={key => controller.setActiveTab(key) }
                items={skipActions ? items.filter(item => item.key !== 'actions') : items}
            />
        </ContainerDiv>
    );
};

MetadataContainer.propTypes = {
    activeTab: PropTypes.string.isRequired,
    layers: PropTypes.array.isRequired,
    metadata: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    showFullGraphics: PropTypes.bool.isRequired,
    hideMetadataXMLLink: PropTypes.bool.isRequired,
    identifications: PropTypes.array.isRequired,
    controller: PropTypes.object.isRequired
};
