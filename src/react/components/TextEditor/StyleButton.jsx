import React from 'react';

export const StyleButton = (props) => {
    const onToggle = (e) => {
        e.preventDefault();
        props.onToggle(props.style);
    };

    let className = 'RichEditor-styleButton';
    if (props.active) {
        className += ' RichEditor-activeButton';
    }

    return (
        <span className={className} onMouseDown={onToggle}>
            {props.label}
        </span>
    );
}