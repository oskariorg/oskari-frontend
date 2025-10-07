
import React from 'react';
import PropTypes from 'prop-types';
import { Badge as AntBadge } from 'antd';
import { ThemeConsumer } from 'oskari-ui/util';
import { getTextColor, getHeaderTheme } from 'oskari-ui/theme/ThemeHelper';

const STYLE = {
    fontWeight: '700',
    whiteSpace: 'nowrap',
    textShadow: '0 -1px 0 rgba(0,0,0,.25)'
};

const ZERO = {
    badge: '#999',
    text: '#fff'
};

export const Badge = ThemeConsumer(({
    theme,
    count,
    showZero = true,
    overflowCount = 999,
    color = getHeaderTheme(theme).getAccentColor(theme),
    ...rest
}) => {
    const badgeColor = count ? color : ZERO.badge;
    const textColor = count ? getTextColor(color) : ZERO.text;

    return <AntBadge count={count} color={badgeColor} showZero={showZero}
        style={{ ...STYLE, color: textColor }}
        overflowCount={overflowCount} {...rest} />;
});

Badge.propTypes = {
    count: PropTypes.any,
    color: PropTypes.string,
    showZero: PropTypes.bool,
    overflowCount: PropTypes.number
};
