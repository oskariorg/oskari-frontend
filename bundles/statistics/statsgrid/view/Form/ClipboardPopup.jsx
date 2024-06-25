import React, { useState } from 'react';
import { Message, TextAreaInput } from 'oskari-ui';
import { LocaleProvider } from 'oskari-ui/util';
import { PrimaryButton, ButtonContainer, SecondaryButton } from 'oskari-ui/components/buttons';
import { showPopup } from 'oskari-ui/components/window';
import styled from 'styled-components';

const BUNDLE_KEY = 'StatsGrid';

const Content = styled('div')`
    display: flex;
    flex-direction: column;
    padding: 20px;
    min-width: 365px;
`;

const ClipboardPopup = ({ controller, onClose }) => {
    const [data, setData] = useState('');
    const onAdd = () => {
        controller.importFromClipboard(data);
        onClose();
    };
    return (
        <Content>
            <TextAreaInput
                placeholder={Oskari.getMsg('StatsGrid', 'userIndicators.import.placeholder')}
                rows={8}
                value={data}
                onChange={(e) => setData(e.target.value)}
            />
            <ButtonContainer>
                <SecondaryButton
                    type='cancel'
                    onClick={onClose}
                />
                <PrimaryButton
                    type='add'
                    onClick={onAdd}
                />
            </ButtonContainer>
        </Content>
    );
};

export const showClipboardPopup = (controller, onClose) => {

    const title = <Message messageKey='userIndicators.flyoutTitle' bundleKey={BUNDLE_KEY} />;
    return showPopup(
        title,
        <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
            <ClipboardPopup controller={controller} onClose={onClose} />
        </LocaleProvider>,
        onClose
    );
};
