import React from 'react';
import PropTypes from 'prop-types';
import { GroupingOption } from '../../../model/GroupingOption';
import { Labelled } from './Labelled';
import { Select, Option } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';

const Grouping = ({ selected, options, controller }) =>
    <Labelled label={'grouping.title'}>
        <Select value={selected} onChange={controller.setGrouping} className="t_grouping">
            {
                options.map(cur =>
                    <Option key={cur.getKey()} value={cur.getKey()}>
                        {cur.getTitle()}
                    </Option>
                )
            }
        </Select>
    </Labelled>;

Grouping.propTypes = {
    selected: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.instanceOf(GroupingOption)).isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};

const memoized = React.memo(Grouping);
export { memoized as Grouping };
