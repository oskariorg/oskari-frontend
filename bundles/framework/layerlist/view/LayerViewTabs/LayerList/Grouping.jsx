import React from 'react';
import PropTypes from 'prop-types';
import { GroupingOption } from '../../../model/GroupingOption';
import { Label } from './Label';
import { Select, Option } from 'oskari-ui';

const Grouping = ({ selected, options, mutator }) =>
    <div>
        <Label>locale.group</Label>
        <Select value={selected} onChange={mutator.setGrouping}>
            {
                options.map(cur =>
                    <Option key={cur.getKey()} value={cur.getKey()}>
                        {cur.getTitle()}
                    </Option>
                )
            }
        </Select>
    </div>;

Grouping.propTypes = {
    selected: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.instanceOf(GroupingOption)).isRequired,
    mutator: PropTypes.object.isRequired
};

const memoized = React.memo(Grouping);
export { memoized as Grouping };
