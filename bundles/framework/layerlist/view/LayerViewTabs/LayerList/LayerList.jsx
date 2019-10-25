
import React from 'react';
import PropTypes from 'prop-types';
import { shapes } from '../propTypes';
import { Spin } from 'oskari-ui';
import { LayerCollapse } from './LayerCollapse/';
import { Filter, Search } from './Filter/';
import { Grouping } from './Grouping';
import { Spinner } from './Spinner';
import { Alert } from './Alert';
import { GroupingOption } from '../../../model/GroupingOption';
import styled from 'styled-components';

const ContentDiv = styled('div')`
    max-width: 600px;
`;
const Controllers = styled('div')`
    display: flex;
    align-items: center;
    padding-bottom: 15px;
    > * {
        width: 250px;
        flex-grow: 1;
        & :not(:last-child) {
            margin-right: 15px;
        }
    }
`;

const Indicator = ({ show, children }) => {
    if (show) {
        return <Spin size="large">{ children }</Spin>;
    }
    return children;
};

const LayerList = props => {
    const { error, loading = false, updating = false, locale, mutator } = props;
    if (error) {
        return <Alert showIcon type="error" description={error}/>;
    }
    const { grouping, filter, collapse } = props;

    // Force select to render on filter change by making the component fully controlled.
    // Clear btn won't clear the value properly without this.
    const filterKey = `${filter.state.activeFilterId}`;
    const { searchText, filters, activeFilterId } = filter.state;

    return (
        <ContentDiv>
            <Controllers>
                <Search searchText={searchText} mutator={filter.mutator} locale={locale} />
            </Controllers>
            <Controllers>
                <Grouping
                    selected={grouping.selected}
                    options={grouping.options}
                    mutator={mutator}
                    locale={locale}/>
                <Filter key={filterKey}
                    filters={filters}
                    activeFilterId={activeFilterId}
                    mutator={filter.mutator}
                    locale={locale}/>
            </Controllers>
            { loading && <Spinner/> }
            { !loading &&
                <Indicator show={updating}>
                    <LayerCollapse {...collapse.state} mutator={collapse.mutator} locale={locale}/>
                </Indicator>
            }
        </ContentDiv>
    );
};

const grouping = {
    selected: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.instanceOf(GroupingOption)).isRequired
};
LayerList.propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool,
    updating: PropTypes.bool,
    locale: PropTypes.object.isRequired,
    collapse: shapes.stateful.isRequired,
    filter: shapes.stateful.isRequired,
    mutator: PropTypes.object.isRequired,
    grouping: PropTypes.shape(grouping).isRequired
};

const memoized = React.memo(LayerList);
export { memoized as LayerList };
