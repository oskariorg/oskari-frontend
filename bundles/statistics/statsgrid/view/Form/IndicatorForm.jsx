import React from 'react';
import { Message, Button } from 'oskari-ui';
import { LocaleProvider } from 'oskari-ui/util';
import { PrimaryButton, SecondaryButton, ButtonContainer } from 'oskari-ui/components/buttons';
import { showPopup } from 'oskari-ui/components/window';
import { StatisticalData } from './StatisticalData';
import { IndicatorCollapse } from './IndicatorCollapse';
import { getRegionsets } from '../../helper/ConfigHelper';

import styled from 'styled-components';

const BUNDLE_KEY = 'StatsGrid';

const Content = styled('div')`
    display: flex;
    flex-direction: column;
    padding: 20px;
    min-width: 365px;
`;

const Warning = styled.div`
    width: 350px;
    font-style: italic;
    margin-top: 10px;
`;

const Title = ({ indicator, showDataTable, regionset, selection }) => {
    if (showDataTable) {
        const regionsetName = getRegionsets().find(rs => rs.id === regionset)?.name || '';
        return (
            <span>
                <Message messageKey='parameters.year' bundleKey={BUNDLE_KEY}/>
                {`: ${selection} - ${regionsetName}`}
            </span>
        );
    }
    const key = !indicator.id ? 'userIndicators.add' : 'userIndicators.edit';
    return <Message messageKey={key} bundleKey={BUNDLE_KEY} />
};

const IndicatorForm = ({ state, controller, onClose }) => {
    const { showDataTable, indicator } = state;
    const showWarning = !showDataTable && !indicator.id && !Oskari.user().isLoggedIn();
    const Component = showDataTable ? StatisticalData : IndicatorCollapse;
    const onSave = () => showDataTable ? controller.saveData() : controller.saveIndicator();
    const onCancel = () => showDataTable ? controller.closeDataTable() : onClose();
    return (
        <Content>
            <Component state={state} controller={controller}/>
            {showWarning && (<Warning><Message messageKey='userIndicators.notLoggedInWarning'/></Warning>)}
            <ButtonContainer>
                <SecondaryButton type='cancel' onClick={onCancel}/>
                {showDataTable && (
                    <Button onClick={() => controller.showClipboardPopup()} >
                        <Message messageKey='userIndicators.import.title' />
                    </Button>
                )}
                <PrimaryButton type='save' onClick={onSave}/>
            </ButtonContainer>
        </Content>
    );
};

export const showIndicatorForm = (state, controller, onClose) => {
    const controls = showPopup(
        <Title {...state}/>,
        <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
            <IndicatorForm state={state} controller={controller} onClose={onClose} />
        </LocaleProvider>,
        onClose
    );

    return {
        ...controls,
        update: (state) => controls.update(
            <Title {...state}/>,
            <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
                <IndicatorForm state={state} controller={controller} onClose={onClose}/>
            </LocaleProvider>
        )
    };
};
