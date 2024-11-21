import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Diagram } from './Diagram';
import { Select, Message } from 'oskari-ui';
import { showFlyout } from 'oskari-ui/components/window';
import { IndicatorName } from '../IndicatorName';
import { FlyoutContent } from '../FlyoutContent';
import { BUNDLE_KEY } from '../../constants';

const Selections = styled('div')`
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: center;
`;
const StyledSelect = styled(Select)`
    max-width: 325px;
`;

const sorters = ['value-descending', 'value-ascending', 'name-descending', 'name-ascending'];
const sortOptions = sorters.map(value => ({ value, label: <Message messageKey={`diagram.sort.${value}`}/> }));

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
                    placeholder={<Message messageKey='diagram.sort.desc' />}
                />
            </Selections>
            <Diagram indicator={current} sortOrder={sortOrder} />
        </Fragment>
    );
};
DiagramFlyout.propTypes = {
    state: PropTypes.object.isRequired,
    controller: PropTypes.object.isRequired
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
    };
};
