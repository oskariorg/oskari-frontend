import React from 'react';
import { Tabs, Spin } from 'oskari-ui';
import { Link } from 'oskari-ui/components/Link';
import { styled } from 'styled-components';
import { BUNDLE_KEY } from '../constants';

const Container = styled('div')`
    padding: 1em;
    min-width: 20em;
    max-width: 50vw;
    max-height: 75vh;
    overflow: auto;
    overflow-wrap: anywhere;
    word-break: break-word;

    ul,
    ol {
        padding-left: 1.25em;
        padding-bottom: 0.9em;
    }

    p {
        padding-bottom: 0.9em;
    }

    img {
        max-width: 100%;
    }
`;

const TabLabel = styled('span')`
    display: inline-block;
`;

const ExternalLinkWrapper = styled('div')`
    margin-bottom: 1em;
`;

const TabContent = ({ tab }) => {
    if (tab.loading) {
        return <Spin />;
    }
    return (
        <>
            {tab.url && (
                <ExternalLinkWrapper>
                    <Link url={tab.url}>
                        {Oskari.getMsg(BUNDLE_KEY, 'flyout.openInNewWindow')}
                    </Link>
                </ExternalLinkWrapper>
            )}
            <div dangerouslySetInnerHTML={{ __html: tab.content || '' }} />
        </>
    );
};

export const UserGuideView = ({ tabs = [], loading }) => {
    if (loading) {
        return (
            <Container>
                <Spin />
            </Container>
        );
    }
    if (tabs.length === 0) {
        return null;
    }
    if (tabs.length === 1) {
        return (
            <Container>
                <TabContent tab={tabs[0]} />
            </Container>
        );
    }
    const items = tabs.map((tab) => ({
        key: tab.key,
        label: <TabLabel>{tab.title || tab.key}</TabLabel>,
        children: (
            <TabContent tab={tab} />
        )
    }));
    return (
        <Container>
            <Tabs items={items} />
        </Container>
    );
};
