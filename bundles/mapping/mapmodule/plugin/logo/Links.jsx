import React from 'react';
import styled from 'styled-components';

const NonIconLink = styled('div')`
    display: inline-block;
    margin: 5px;
`;

const Link = styled('div')`
    display: inline-block;
`;

export const Links = ({ links }) => {
    const labels = [];
    links.forEach(link => {
        const callback = typeof link.options.callback === 'function' ? link.options.callback : null;
        if (link.options.id !== 'icon') {
            labels.push(
                <NonIconLink key={link.options.id} className={link.options.id && link.options.id.toLowerCase()}><a onClick={callback ? callback : null}>{link.title}</a></NonIconLink>
            )
        } else {
            labels.push(
                <Link key={link.options.id} className={link.options.id && link.options.id.toLowerCase()}><a onClick={callback ? callback : null}>{link.title}</a></Link>
            )
        }
    });
    return (
        <div>
            {labels}
        </div>
    );
};
