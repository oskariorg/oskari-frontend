import React from 'react';
import { Message } from 'oskari-ui';
import { LocaleProvider } from 'oskari-ui/util';
import { PrimaryButton, SecondaryButton, ButtonContainer } from 'oskari-ui/components/buttons';
import { showPopup } from 'oskari-ui/components/window';
import { StatisticalData } from './StatisticalData';
import { IndicatorCollapse } from './IndicatorCollapse';

import styled from 'styled-components';

const BUNDLE_KEY = 'StatsGrid';

const Content = styled('div')`
    display: flex;
    flex-direction: column;
    padding: 20px;
    min-width: 365px;
`;

const IndicatorForm = ({ state, controller, onClose }) => {
    const { showDataTable } = state;
    const Component = showDataTable ? StatisticalData : IndicatorCollapse;
    const onSave = () => showDataTable ? controller.saveData() : controller.saveIndicator();
    const onCancel = () => showDataTable ? controller.closeDataTable() : onClose();
    return (
        <Content>
            <Component state={state} controller={controller}/>
            <ButtonContainer>
                <SecondaryButton type='cancel' onClick={onCancel}/>
                <PrimaryButton type='save' onClick={onSave}/>
            </ButtonContainer>
        </Content>
    );
};

export const showIndicatorForm = (state, controller, onClose) => {

    const title = <Message messageKey='userIndicators.flyoutTitle' bundleKey={BUNDLE_KEY} />;
    const controls = showPopup(
        title,
        <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
            <IndicatorForm state={state} controller={controller} />
        </LocaleProvider>,
        onClose
    );

    return {
        ...controls,
        update: (state) => controls.update(
            title,
            <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
                <IndicatorForm state={state} controller={controller} />
            </LocaleProvider>
        )
    };
};
