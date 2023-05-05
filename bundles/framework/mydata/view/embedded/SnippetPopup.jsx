
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Message, Tooltip, CopyField } from 'oskari-ui';
import styled from 'styled-components';
import { SecondaryButton, ButtonContainer, CopyButton } from 'oskari-ui/components/buttons';
import { showPopup } from 'oskari-ui/components/window';
import { LocaleProvider } from 'oskari-ui/util';

const BUNDLE_NAME = 'MyData';
const POPUP_OPTIONS = {
    id: BUNDLE_NAME + '-snippet'
};

const Content = styled.div`
    margin: 12px 24px 24px;
`;

const SnippetPopup = ({html, onClose}) => {
    const [highlighted, setHighlighted] = useState(false);

    const highlightUrl = () => {
        setHighlighted(true);
        setTimeout(() => {
            setHighlighted(false);
        }, 1000);
    }

    return (
        <Content>
            <Message messageKey="tabs.publishedmaps.published.desc" />
            <CopyField
                value={html}
                highlighted={highlighted}
            />
            <ButtonContainer>
                <SecondaryButton type='cancel' onClick={onClose}/>
                <Tooltip title={<Message messageKey={`tabs.publishedmaps.published.copy`} />}>
                    <CopyButton
                        value={html}
                        onClick={() => highlightUrl()}
                    />
                </Tooltip>
            </ButtonContainer>
        </Content>
    );
};

export const showSnippetPopup = (view, onClose) => {
    const title = <Message messageKey="tabs.publishedmaps.getHTML" bundleKey={BUNDLE_NAME} />;

    const url = Oskari.getSandbox().createURL(view.url);
    const size = view.metadata && view.metadata.size ? view.metadata.size : undefined;
    const width = size ? size.width + 'px' : '100%';
    const height = size ? size.height + 'px' : '100%';
    let iframeCode = '<iframe src="' + url + '" allow="geolocation" style="border: none;';
    if (width !== null && width !== undefined) {
        iframeCode += ' width: ' + width + ';';
    }
    if (height !== null && height !== undefined) {
        iframeCode += ' height: ' + height + ';';
    }
    iframeCode += '"></iframe>';

    const content = (
        <LocaleProvider value={{ bundleKey: BUNDLE_NAME }}>
            <SnippetPopup html={iframeCode} onClose={onClose} />
        </LocaleProvider>
    );
    return showPopup(title, content, onClose, POPUP_OPTIONS);
}

showSnippetPopup.propTypes = {
    view: PropTypes.object,
    onClose: PropTypes.func.isRequired
};
