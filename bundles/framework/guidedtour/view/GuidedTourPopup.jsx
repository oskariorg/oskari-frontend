import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { showPopup } from 'oskari-ui/components/window';
import { PrimaryButton, SecondaryButton, ButtonContainer } from 'oskari-ui/components/buttons';
import { Checkbox, Message, Button } from 'oskari-ui';
import styled from 'styled-components';

const BUNDLE_KEY = 'GuidedTour';
const POPUP_OPTIONS = {
    id: BUNDLE_KEY
};

const StyledContent = styled('div')`
    margin: 12px 24px 24px;
    min-width: 300px;
`;

const StyledLink = styled(Button)`
    display: block;
    margin: 10px 0 10px;
`;

const StyledTitle = styled('div')`
    display: flex;
    width: 100%;
    justify-content: space-between;
`;

const getTitle = (title, state) => {
    let popupTitle = title;
    if (state.step > 0) {
        popupTitle = <StyledTitle>
            <span>{title}</span>
            <span>{state.step} / {state.steps.length - 1}</span>
        </StyledTitle>;
    }
    return popupTitle;
}

const GuidedTourContent = ({ content, links, step, steps, controller, onClose }) => {
    const [dontShowAgain, setDontShowAgain] = useState(false);
    const [contentLinks, setContentLinks] = useState([]);

    useEffect(() => {
        setContentLinks(links);
    }, [links])

    return (
        <StyledContent>
            {content}
            {contentLinks.map((link, index) => {
                if (link.visible) {
                    return (
                        <StyledLink key={`link-${index}`} className='t_button t_flyout_visibility' onClick={() => {
                            setContentLinks(contentLinks.map(l => {
                                return (
                                    {
                                        ...l,
                                        visible: !l.visible
                                    }
                                )
                            }));
                            link.onClick();
                        }}>
                            {link.title}
                        </StyledLink>
                    );
                }
            })}
            <ButtonContainer>
                {(step === 0 || step === steps.length - 1) && (
                    <Checkbox checked={dontShowAgain} onChange={(e) => setDontShowAgain(e.target.checked)}>
                        <Message bundleKey={BUNDLE_KEY} messageKey='tourseen.label' />
                    </Checkbox>
                )}
                {step === 0 && (
                    <SecondaryButton type='close' onClick={() => onClose(dontShowAgain)} />
                )}
                {step > 0 && (
                    <SecondaryButton type='previous' onClick={controller.previous} />
                )}
                {step < steps.length - 1 && (
                    <PrimaryButton type='next' onClick={controller.next} />
                )}
                {step === steps.length - 1 && (
                    <PrimaryButton type='close' onClick={() => onClose(dontShowAgain)} />
                )}
            </ButtonContainer>
        </StyledContent>
    );
};

export const showGuidedTourPopup = (title, popupContent, links, state, controller, onClose) => {
    const guidedTourContent = <GuidedTourContent
        content={popupContent}
        links={links}
        step={state.step}
        steps={state.steps}
        controller={controller}
        onClose={onClose}
    />;

    const controls = showPopup(getTitle(title, state), guidedTourContent, onClose, POPUP_OPTIONS);
    return {
        ...controls,
        update: (title, content, links, state, controller, onClose) => {
            controls.update(
                getTitle(title, state),
                <GuidedTourContent
                    content={content}
                    links={links}
                    step={state.step}
                    steps={state.steps}
                    controller={controller}
                    onClose={onClose}
                />
            );
        }
    };
};

showGuidedTourPopup.propTypes = {
    title: PropTypes.string.isRequired,
    popupContent: PropTypes.any.isRequired,
    links: PropTypes.array,
    state: PropTypes.object.isRequired,
    controller: PropTypes.object.isRequired
};
