import React from 'react';
import { Message, Collapse, CollapsePanel } from 'oskari-ui';
import { LocaleProvider } from 'oskari-ui/util';
import { PrimaryButton, ButtonContainer } from 'oskari-ui/components/buttons';
import { showPopup } from 'oskari-ui/components/window';
import { IndicatorInfo } from './IndicatorInfo';
import { StatisticalInfo } from './StatisticalInfo';
import { StatisticalData } from './StatisticalData';
import { IndicatorDatasets } from './IndicatorDatasets';
import styled from 'styled-components';

const BUNDLE_KEY = 'StatsGrid';

const Content = styled('div')`
    display: flex;
    flex-direction: column;
    padding: 20px;
    min-width: 365px;
`;

const IndicatorForm = ({ state, controller }) => {
    return (
        <Content>
            <Collapse defaultActiveKey={state.indicator ? 'data' : 'info'}>
                <CollapsePanel key='info' header={<Message messageKey='userIndicators.panelGeneric.title' />}>
                    <IndicatorInfo
                        state={state}
                        controller={controller}
                    />
                </CollapsePanel>
                <CollapsePanel key='data' header={<Message messageKey='userIndicators.panelData.title' />}>
                    {state.selectedDataset ? (
                        <StatisticalData
                            state={state}
                            controller={controller}
                        />
                    ) : (
                        <div>
                            {state.datasets?.length > 0 && (
                                <IndicatorDatasets
                                    state={state}
                                    controller={controller}
                                />
                            )}
                            <StatisticalInfo
                                state={state}
                                controller={controller}
                            />
                        </div>
                    )}
                </CollapsePanel>
            </Collapse>
            <ButtonContainer>
                <PrimaryButton
                    type='save'
                    onClick={() => controller.saveForm()}
                />
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
