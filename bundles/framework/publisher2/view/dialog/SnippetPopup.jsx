import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Message, CopyField, Switch } from 'oskari-ui';
import styled from 'styled-components';
import { SecondaryButton, ButtonContainer, CopyButton } from 'oskari-ui/components/buttons';
import { InfoIcon } from 'oskari-ui/components/icons';
import { showPopup } from 'oskari-ui/components/window';
import { LocaleProvider } from 'oskari-ui/util';
import { BUNDLE_KEY } from '../../constants';

const POPUP_OPTIONS = {
    id: BUNDLE_KEY + '-snippet'
};

const Content = styled.div`
    margin: 12px 24px 24px;
`;

const ParamsToggle = styled.div`
    display: flex;
    flex-flow: row nowrap;
    margin-top: 24px;
`;

const SnippetPopup = ({ view, params, onClose }) => {
    const [highlighted, setHighlighted] = useState(false);
    const [showParams, setShowParams] = useState(false);

    const highlightUrl = () => {
        setHighlighted(true);
        setTimeout(() => {
            setHighlighted(false);
        }, 1000);
    };
    const { url, published, metadata } = view;
    const { width, height } = metadata.size || {};

    // prepareQueryString if params are shown
    let src = Oskari.getSandbox().createURL(url, showParams);
    if (params && showParams) {
        const paramsList = Object.entries(params).map(([key, value]) => `${key}=${value}`);
        src += paramsList.join('&');
    }
    const w = isNaN(width) ? '100%' : width + 'px';
    const h = isNaN(height) ? '100%' : height + 'px';
    const html = `<iframe src="${src}" allow="geolocation" style="border: none; width: ${w}; height: ${h};"></iframe>`;

    return (
        <Content>
            <Message messageKey={`${published ? 'published' : 'snippet'}.desc`} />
            <CopyField
                value={html}
                highlighted={highlighted} />
            { !!params &&
                <ParamsToggle>
                    <Switch size='small' checked={showParams} onChange={setShowParams} label={<Message messageKey='snippet.params'/>}/>
                    <InfoIcon title={<Message messageKey='snippet.paramsTip'/>}/>
                </ParamsToggle>
            }
            <ButtonContainer>
                <SecondaryButton type='close' onClick={onClose}/>
                <CopyButton
                    value={html}
                    onClick={() => highlightUrl()}/>
            </ButtonContainer>
        </Content>
    );
};
SnippetPopup.propTypes = {
    view: PropTypes.object.isRequired,
    params: PropTypes.object,
    onClose: PropTypes.func.isRequired
};

export const showSnippetPopup = (view, onClose, params) => {
    const title = <Message messageKey={`${view.published ? 'published' : 'snippet'}.title`} bundleKey={BUNDLE_KEY} />;

    const content = (
        <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
            <SnippetPopup view={view} params={params} onClose={onClose} />
        </LocaleProvider>
    );
    const controls = showPopup(title, content, onClose, POPUP_OPTIONS);
    return {
        ...controls,
        update: (params) => (
            controls.update(
                title,
                <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
                    <SnippetPopup view={view} params={params} onClose={onClose} />
                </LocaleProvider>
            )
        )
    };
};
