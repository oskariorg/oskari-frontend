import React, { useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import JoditEditor from 'jodit-react';

export const RichEditor = (props) => {
    const editor = useRef(null);
    const content = props.value || '';
    const config = useMemo(
        () => ({
            language: Oskari.getLang(),
            addNewLine: false,
            buttons: ['bold',
                'italic',
                'underline',
                'strikethrough',
                'eraser',
                'ul',
                'ol',
                'paragraph',
                'link',
                'undo',
                'redo'],
            readonly: false, // all options from https://xdsoft.net/jodit/docs/,
            toolbarAdaptive: false,
            // Init field with empty placeholder
            // TODO: use some placeholder by lang?
            // would require localizations on oskariui loc bundle/key
            placeholder: ''
        }),
        [Oskari.getLang()]
        // Never really changes, but might change if we add placeholders AND lang is changed
    );

    function onBlur (newContent) {
        props.onChange({ target: { value: newContent } });
    }

    return (
        <JoditEditor
            ref={editor}
            value={content}
            config={config}
            tabIndex={1} // tabIndex of textarea
            onBlur={onBlur} // preferred to use only this option to update the content for performance reasons
        />
    );
};

RichEditor.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func
};
