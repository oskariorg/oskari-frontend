
import React from 'react';
import PropTypes from 'prop-types';
import { Badge as AntBadge } from 'antd';
import { ThemeConsumer } from 'oskari-ui/util';
import { getTextColor, getHeaderTheme } from 'oskari-ui/theme/ThemeHelper';
import 'antd/es/badge/style/index.js';

const STYLE = {
    fontWeight: '700',
    whiteSpace: 'nowrap',
    textShadow: '0 -1px 0 rgba(0,0,0,.25)'
};

export const Badge = ThemeConsumer(({
    theme,
    count,
    themed,
    inversed,
    showZero = true,
    overflowCount = 999,
    color: propsColor,
    ...rest
}) => {
    const useTheme = themed && theme;
    let color = propsColor;
    if (useTheme) {
        color = getHeaderTheme(theme).getAccentColor(theme);
    } else if (inversed) {
        color = '#333';
    } else if (!propsColor) {
        color = '#999';
    }
    // use always white for #333 and #999
    const textColor = useTheme || propsColor ? getTextColor(color) : '#fff';
    return <AntBadge count={count} color={color} showZero={showZero}
        style={{ ...STYLE, color: textColor }}
        overflowCount={overflowCount} {...rest} />;
});

Badge.propTypes = {
    count: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    inversed: PropTypes.bool,
    showZero: PropTypes.bool,
    themed: PropTypes.bool
};
