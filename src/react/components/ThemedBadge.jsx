
import React from 'react';
import PropTypes from 'prop-types';
import { Badge as AntBadge } from 'antd';
import { ThemeConsumer } from '../util';
import 'antd/es/badge/style/index.js';
import { getTextColor, getHeaderTheme } from 'oskari-ui/theme/ThemeHelper';

export const ThemedBadge = ThemeConsumer(({ count, theme, ...rest }) => {
    const helper = getHeaderTheme(theme);
    const style = {
        backgroundColor: helper.getAccentColor(),
        color: getTextColor(helper.getAccentColor()),
        whiteSpace: 'nowrap',
    };
    return <AntBadge count={count} style={style} overflowCount={999} showZero={true} {...rest} />;
});
ThemedBadge.propTypes = {
    count: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    inversed: PropTypes.bool
};
