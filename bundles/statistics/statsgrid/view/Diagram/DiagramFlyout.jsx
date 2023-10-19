import React from 'react';
import { Diagram } from './Diagram';
import { Select, Message, Spin } from 'oskari-ui';
import { showFlyout } from 'oskari-ui/components/window';
import styled from 'styled-components';
import { LocaleProvider } from 'oskari-ui/util';

const BUNDLE_KEY = 'StatsGrid';

const Content = styled('div')`
    padding: 20px;
    display: flex;
    flex-direction: column;
    max-width: 700px;
`;
const Selections = styled('div')`
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: center;
`;
const StyledSelect = styled(Select)`
    max-width: 325px;
`;

const sortOptions = [
    {
        value: 'value-descending',
        label: <Message messageKey='datacharts.sorting.value-descending' bundleKey={BUNDLE_KEY} />
    },
    {
        value: 'value-ascending',
        label: <Message messageKey='datacharts.sorting.value-ascending' bundleKey={BUNDLE_KEY} />
    },
    {
        value: 'name-ascending',
        label: <Message messageKey='datacharts.sorting.name-ascending' bundleKey={BUNDLE_KEY} />
    },
    {
        value: 'name-descending',
        label: <Message messageKey='datacharts.sorting.name-descending' bundleKey={BUNDLE_KEY} />
    }
];

const DiagramFlyout = ({ state, controller }) => {

    const Component = (
        <Content>
           <Selections>
                <StyledSelect
                    filterOption={false}
                    options={state.indicators?.map(indicator => ({ value: indicator.hash, label: indicator.labels?.full }))}
                    onChange={(value) => controller.setActiveIndicator(value)}
                    value={state.activeIndicator}
                />
                <StyledSelect
                    filterOption={false}
                    options={sortOptions}
                    onChange={(value) => controller.setSortOrder(value)}
                    value={state.sortOrder}
                />
           </Selections>
           <Diagram state={state} controller={controller} />
        </Content>
    );
    
    if (state.loading) {
        return <Spin showTip={true}>{Component}</Spin>;
    }
    return Component;
};

export const showDiagramFlyout = (state, controller, onClose) => {
    const title = <Message bundleKey={BUNDLE_KEY} messageKey='tile.diagram' />;
    const controls = showFlyout(
        title,
        <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
            <DiagramFlyout state={state} controller={controller} />
        </LocaleProvider>,
        onClose
    );

    return {
        ...controls,
        update: (state) => controls.update(
            title,
            <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
                <DiagramFlyout state={state} controller={controller} />
            </LocaleProvider>
        )
    }
};
