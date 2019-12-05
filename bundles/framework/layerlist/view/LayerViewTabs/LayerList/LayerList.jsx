
import React from 'react';
import PropTypes from 'prop-types';
import { shapes } from '../propTypes';
import { Spin, Tooltip, Icon } from 'oskari-ui';
import { Mutator, withLocale } from 'oskari-ui/util';
import { LayerCollapse } from './LayerCollapse/';
import { Filter, Search } from './Filter/';
import { Grouping } from './Grouping';
import { Spinner } from './Spinner';
import { Alert } from './Alert';
import { CreateTools } from './CreateTools';
import { GroupingOption } from '../../../model/GroupingOption';
import styled from 'styled-components';

const Column = styled('div')`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    ${props => props.spacing && `
        > :not(:last-child) {
            margin-bottom: ${props.spacing};
        }
    `}
`;
const Row = styled('div')`
    display: flex;
    min-width: 200px;
    ${props => props.spacing && `
        > :not(:last-child) {
            margin-right: ${props.spacing};
        }
    `}
`;
const ControlsRow = styled(Row)`
    > * {
        flex-grow: 1;
        flex-basis: 200px;
    }
`;

const InfoIcon = styled(Icon)`
    color: #979797;
    font-size: 20px;
    margin-top: 5px;
`;

const Content = styled(Column)`
    max-width: 600px;
    min-width: 500px;
`;

const Indicator = ({ show, children }) => {
    if (show) {
        return <Spin size="large">{ children }</Spin>;
    }
    return children;
};

const LayerList = React.forwardRef((props, ref) => {
    const { error, loading = false, updating = false, mutator, Message } = props;
    if (error) {
        return <Alert showIcon type="error" description={error}/>;
    }
    const { grouping, filter, collapse, createTools } = props;

    // Force select to render on filter change by making the component fully controlled.
    // Clear btn won't clear the value properly without this.
    const filterKey = `${filter.state.activeFilterId}`;
    const { searchText, filters, activeFilterId } = filter.state;

    return (
        <Content spacing={'15px'}>
            <Row spacing={'8px'}>
                <Column spacing={'10px'}>
                    <Search ref={ref} searchText={searchText} mutator={filter.mutator} />
                    <ControlsRow spacing={'10px'}>
                        <Grouping
                            selected={grouping.selected}
                            options={grouping.options}
                            mutator={mutator}/>
                        <Filter key={filterKey}
                            filters={filters}
                            activeFilterId={activeFilterId}
                            mutator={filter.mutator}/>
                    </ControlsRow>
                </Column>
                <div>
                    <Tooltip title={<Message messageKey='filter.search.tooltip'/>}>
                        <InfoIcon type="question-circle" />
                    </Tooltip>
                </div>
                <div>
                    <CreateTools tools={createTools} />
                </div>
            </Row>
            { loading && <Spinner/> }
            { !loading &&
                <Indicator show={updating}>
                    <LayerCollapse {...collapse.state} mutator={collapse.mutator}/>
                </Indicator>
            }
        </Content>
    );
});
LayerList.displayName = 'LayerList';
const grouping = {
    selected: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.instanceOf(GroupingOption)).isRequired
};
LayerList.propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool,
    updating: PropTypes.bool,
    collapse: shapes.stateful.isRequired,
    filter: shapes.stateful.isRequired,
    createTools: PropTypes.array,
    grouping: PropTypes.shape(grouping).isRequired,
    mutator: PropTypes.instanceOf(Mutator).isRequired,
    Message: PropTypes.elementType.isRequired
};

const wrapped = withLocale(React.memo(LayerList));
export { wrapped as LayerList };
