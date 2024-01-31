import React from 'react';
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

const ClipboardPopup = ({ state, controller, onClose }) => {
    return (
        <Content>
            <TextAreaInput
                placeholder={Oskari.getMsg('StatsGrid', 'userIndicators.import.placeholder')}
                rows={8}
                value={state.clipboardValue}
                onChange={(e) => controller.setClipboardValue(e.target.value)}
            />
            <ButtonContainer>
                <SecondaryButton
                    type='cancel'
                    onClick={onClose}
                />
                <PrimaryButton
                    type='add'
                    onClick={() => controller.importFromClipboard()}
                />
            </ButtonContainer>
        </Content>
    );
};

export const showClipboardPopup = (state, controller, onClose) => {

    const title = <Message messageKey='userIndicators.flyoutTitle' bundleKey={BUNDLE_KEY} />;
    const controls = showPopup(
        title,
        <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
            <ClipboardPopup state={state} controller={controller} onClose={onClose} />
        </LocaleProvider>,
        onClose
    );

    return {
        ...controls,
        update: (state) => controls.update(
            title,
            <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
                <ClipboardPopup state={state} controller={controller} onClose={onClose} />
            </LocaleProvider>
        )
    };
};
