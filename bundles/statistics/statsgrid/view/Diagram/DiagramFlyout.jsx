import React, { Fragment, useState } from 'react';
import { Diagram } from './Diagram';
import { Select, Message } from 'oskari-ui';
import { showFlyout } from 'oskari-ui/components/window';
import styled from 'styled-components';
import { IndicatorName } from '../IndicatorName';
import { FlyoutContent } from '../FlyoutContent';

const BUNDLE_KEY = 'StatsGrid';

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
    const { indicators, activeIndicator } = state;
    const current = indicators.find(ind => ind.hash === activeIndicator);
    const [sortOrder, setSortOrder] = useState('value-descending');
    return (
        <Fragment>
            <Selections>
                <StyledSelect
                    filterOption={false}
                    options={indicators?.map(indicator => ({ value: indicator.hash, label: <IndicatorName indicator={indicator} /> }))}
                    onChange={(value) => controller.setActiveIndicator(value)}
                    value={activeIndicator}
                    placeholder={<Message messageKey='panels.newSearch.selectIndicatorPlaceholder' />}
                />
                <StyledSelect
                    filterOption={false}
                    options={sortOptions}
                    onChange={(value) => setSortOrder(value)}
                    value={sortOrder}
                    placeholder={<Message messageKey='datacharts.sorting.desc' />}
                />
            </Selections>
            <Diagram indicator={current} sortOrder={sortOrder} />
        </Fragment>
    );
};

export const showDiagramFlyout = (state, controller, onClose) => {
    const title = <Message bundleKey={BUNDLE_KEY} messageKey='tile.diagram' />;
    const controls = showFlyout(
        title,
        <FlyoutContent state={state}>
            <DiagramFlyout state={state} controller={controller} />
        </FlyoutContent>,
        onClose
    );

    return {
        ...controls,
        update: (state) => controls.update(
            title,
            <FlyoutContent state={state}>
                <DiagramFlyout state={state} controller={controller} />
            </FlyoutContent>
        )
    }
};
