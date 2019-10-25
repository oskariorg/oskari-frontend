import React from 'react';
import PropTypes from 'prop-types';
import { GroupingOption } from '../../../model/GroupingOption';
import { Label } from './Label';
import { Select, Option } from 'oskari-ui';
import { Mutator } from 'oskari-ui/util';

const Grouping = ({ selected, options, mutator, locale }) =>
    <div>
        <Label>{ locale.grouping.title }</Label>
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
    mutator: PropTypes.instanceOf(Mutator).isRequired,
    locale: PropTypes.object.isRequired
};

const memoized = React.memo(Grouping);
export { memoized as Grouping };
