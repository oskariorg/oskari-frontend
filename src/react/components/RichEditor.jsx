import React, { useState, useRef , useEffect} from "react";
import { convertFromHTML, Editor, EditorState, ContentState, RichUtils, getDefaultKeyBinding } from 'draft-js';
import { InlineStyleControls, BlockStyleControls } from './TextEditor';
import { stateToHTML } from 'draft-js-export-html';
import './TextEditor/RichText.css';
import 'draft-js/dist/Draft.css';

export const RichEditor = (props) => {
  const [ editorState, setEditorState ] = useState(EditorState.createEmpty());
  const editorRef = useRef("editor");
  var initialState;

  useEffect(() => {
    if (props.value != undefined) {
      const blocksFromHtml =  convertFromHTML(props.value);
      const { contentBlocks, entityMap } = blocksFromHtml;
      const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
      initialState = EditorState.createWithContent(contentState);
      setEditorState(initialState);
    }
  }, [])

  const focus = () => editorRef.current.focus();
  const onChange = (editorState) => updateEditorState(editorState);

  // If the user changes block type before entering any text, we can
  // either style the placeholder or hide it. Let's just hide it now.
  let className = 'RichEditor-editor';
  var contentState = editorState.editorState ? editorState.editorState.getCurrentContent() : editorState.getCurrentContent();
  if (!contentState.hasText()) {
    if (contentState.getBlockMap().first().getType() !== 'unstyled') {
      className += ' RichEditor-hidePlaceholder';
    }
  }

  const updateEditorState = (editorstate) => {
    props.onChange({target: { value: stateToHTML(editorstate.getCurrentContent())}});
    setEditorState(editorstate);
  }
          
  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
        onChange(newState);
        return true;
    }
    return false;
  }
          
  const mapKeyToEditorCommand = (e) => {
    if (e.keyCode === 9 /* TAB */) {
      const newEditorState = RichUtils.onTab(
        e,
        editorState,
        4, /* maxDepth */
      );
      if (newEditorState !== editorState) {
        onChange(newEditorState);
      }
      return;
    }
    return getDefaultKeyBinding(e);
  }
          
  const toggleBlockType = (blockType) => {
    onChange(
      RichUtils.toggleBlockType(
        editorState,
        blockType
      )
    );
  }
          
  const toggleInlineStyle = (inlineStyle) => {
    onChange(
      RichUtils.toggleInlineStyle(
        editorState,
        inlineStyle
      )
    );
  }

  return (
    <div className="RichEditor-root">
      <BlockStyleControls
        editorState={editorState}
        onToggle={toggleBlockType}
      />
      <InlineStyleControls
        editorState={editorState}
        onToggle={toggleInlineStyle}
      />
      <div className={className} onClick={focus}>
        <Editor
          blockStyleFn={getBlockStyle}
          customStyleMap={styleMap}
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          keyBindingFn={mapKeyToEditorCommand}
          onChange={onChange}
          placeholder="Tell a story..."
          ref={editorRef}
          spellCheck={false}
        />
      </div>
    </div>
  );
}

// Custom overrides for "code" style.
const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};

const getBlockStyle = (block) => {
  switch (block.getType()) {
    case 'blockquote': return 'RichEditor-blockquote';
    default: return null;
  }
}