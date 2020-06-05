import React from 'react';
import PropTypes from 'prop-types';

const PLAYPATH = 'M11,8 L18,11.74 18,20.28 11,24 11,8 M18,11.74 L26,16 26,16 18,20.28 18,11.74';
const PAUSEPATH = 'M9,8 L14,8 14,24 9,24 9,8 M19,8 L24,8 24,24 19,24 19,8';

export const PlayButton = ({ initial }) => {
    const animateRef = React.createRef();
    const [status, setStatus] = React.useState(initial);
    const [d, setD] = React.useState('M11,8 L26,16 11,24 11,8');
    const [from, setFrom] = React.useState(status ? PLAYPATH : PAUSEPATH);
    const [to, setTo] = React.useState(status ? PAUSEPATH : PLAYPATH);
    const dur = '0.1s';
    const setPause = (d, from, to) => {
        setD(d);
        setFrom(from);
        setTo(to);
        if (animateRef.current) {
            animateRef.current.beginElement();
        }
    };
    const changeState = () => {
        const d = status ? PLAYPATH : PAUSEPATH;
        const from = status ? PAUSEPATH : PLAYPATH;
        const to = status ? PLAYPATH : PAUSEPATH;
        setPause(d, from, to);
        setStatus(!status);
    };
    return (
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 40 40' onClick={changeState}>
            <path d={d}>
                <animate ref={animateRef} from={from} to={to} attributeName='d' fill='freeze' dur={dur} calcMode='spline' keySplines='0.19 1 0.22 1'/>
            </path>
        </svg>
    );
};
PlayButton.propTypes = {
    initial: PropTypes.bool.isRequired
};

// export const PlayPauseIcon = ({ initial, ...rest }) => <Icon component={() => <PlayPauseIconSvg initial={initial} />} {...rest} />;
// PlayPauseIcon.propTypes = {
//     initial: PropTypes.bool.isRequired
// };
