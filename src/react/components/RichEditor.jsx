import React, { useState, useRef, useMemo, useEffect } from 'react';
import JoditEditor from 'jodit-react';

export const RichEditor = (props) => {
	const editor = useRef(null);
	const [content, setContent] = useState('');
	const config = useMemo(
		() => ({
            language: Oskari.getLang(),
            addNewLine: false,
            buttons: ['bold','italic','underline','strikethrough','eraser','ul','ol','paragraph','link','undo','redo'],
			readonly: false, // all options from https://xdsoft.net/jodit/docs/,
            toolbarAdaptive: false,
			placeholder: ''
		}),
		[props.value]
	);


    useEffect(() => {
        if (props.value !== undefined) {
            setContent(props.value)
        }
    }, [])

    function onBlur (newContent) {
        props.onChange({ target: { value: newContent } });
        setContent(newContent);
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