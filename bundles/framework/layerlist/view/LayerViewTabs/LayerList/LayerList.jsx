
import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'oskari-ui';
import { LayerCollapse } from './LayerCollapse/';
import { Alert } from './Alert';
import styled from 'styled-components';
import { GroupingOption } from '../../../model/GroupingOption';
import { Grouping } from './Grouping';
import { Filter } from './Filter';
import { Spinner } from './Spinner';

const ContentDiv = styled('div')`
    max-width: 600px;
`;
const ListControllers = styled('div')`
    display: flex;
    align-items: center;
    padding-bottom: 5px;
    > :not(:last-child) {
        margin-right: 10px;
    }
    ${Select} {
        min-width: 180px;
    }
`;

export const LayerList = props => {
    const { error, loading = false, locale, mutator } = props;
    if (error) {
        return <Alert showIcon type="error" description={error}/>;
    }
    const { grouping, filter, collapse } = props;

    // Force select to render on filter change. Clear btn click did not clear the value properly without this.
    const filterKey = `${filter.state.activeFilterId}`;

    return (
        <ContentDiv>
            <ListControllers>
                <Grouping selected={grouping.selected} options={grouping.options} mutator={mutator}/>
                <Filter key={filterKey} {...filter.state} mutator={filter.mutator}/>
            </ListControllers>
            { loading && <Spinner/> }
            { !loading && <LayerCollapse {...collapse.state} mutator={collapse.mutator} locale={locale}/> }
        </ContentDiv>
    );
};

const stateful = {
    state: PropTypes.object,
    mutator: PropTypes.object
};
const grouping = {
    selected: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.instanceOf(GroupingOption)).isRequired
};
LayerList.propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool,
    locale: PropTypes.object.isRequired,
    collapse: PropTypes.shape(stateful).isRequired,
    filter: PropTypes.shape(stateful).isRequired,
    mutator: PropTypes.object.isRequired,
    grouping: PropTypes.shape(grouping).isRequired
};
