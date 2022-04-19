import React from 'react';
import {Editor, EditorState, ContentState, RichUtils, getDefaultKeyBinding, Modifier, SelectionState} from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import './TextEditor/RichText.css';
import 'draft-js/dist/Draft.css';
import { Button } from 'antd';

import { InlineStyleControls, BlockStyleControls } from './TextEditor/';

      class RichEditor extends React.Component {
        constructor(props) {
          super(props);
          this.updateEditorState = this._updateEditorState.bind(this);
          if (this.props.value != undefined) {
            const blocksFromHtml = htmlToDraft(this.props.value);
            const { contentBlocks, entityMap } = blocksFromHtml;
            const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);

            this.state = {editorState: EditorState.createWithContent(contentState)};
          } else { 
            this.state = {editorState: EditorState.createEmpty()};
          }

          this.focus = () => this.refs.editor.focus();
          this.onChange = (editorState) => this.updateEditorState({editorState});

          this.handleKeyCommand = this._handleKeyCommand.bind(this);
          this.mapKeyToEditorCommand = this._mapKeyToEditorCommand.bind(this);
          this.toggleBlockType = this._toggleBlockType.bind(this);
          this.toggleInlineStyle = this._toggleInlineStyle.bind(this);
        }

        _updateEditorState(editorstate) {
          this.props.onChange({target: { value: {editorstate}}});
          this.setState(editorstate);
        }

        _handleKeyCommand(command, editorState) {
          const newState = RichUtils.handleKeyCommand(editorState, command);
          if (newState) {
            this.onChange(newState);
            return true;
          }
          return false;
        }

        _mapKeyToEditorCommand(e) {
          if (e.keyCode === 9 /* TAB */) {
            const newEditorState = RichUtils.onTab(
              e,
              this.state.editorState,
              4, /* maxDepth */
            );
            if (newEditorState !== this.state.editorState) {
              this.onChange(newEditorState);
            }
            return;
          }
          return getDefaultKeyBinding(e);
        }

        _toggleBlockType(blockType) {
          this.onChange(
            RichUtils.toggleBlockType(
              this.state.editorState,
              blockType
            )
          );
        }

        _toggleInlineStyle(inlineStyle) {
          this.onChange(
            RichUtils.toggleInlineStyle(
              this.state.editorState,
              inlineStyle
            )
          );
        }

        clear() {
            const editorState = this.state.editorState;
            const contentState = editorState.getCurrentContent();
            let contentWithoutLists = contentState;
            let newEditorState = editorState;
            const blocksMap = contentState.getBlockMap();
            blocksMap.forEach(block => {
                const blockType = block.getType();
                if (
                  blockType === 'ordered-list-item' ||
                  blockType === 'unordered-list-item'
                ) {
                  const selectionState = SelectionState.createEmpty(block.getKey());
                  const updatedSelection = selectionState.merge({
                    focusOffset: 0,
                    anchorOffset: block.getText().length
                  });
            
                  contentWithoutLists = Modifier.setBlockType(
                    contentWithoutLists,
                    updatedSelection,
                    'unstyled'
                  );
                }
              });
            
              newEditorState = EditorState.push(
                newEditorState,
                contentWithoutLists,
                'change-block-type'
              );
            this.updateEditorState(newEditorState);
          }

        render() {
          const {editorState} = this.state;

          // If the user changes block type before entering any text, we can
          // either style the placeholder or hide it. Let's just hide it now.
          let className = 'RichEditor-editor';
          var contentState = editorState.getCurrentContent();
          if (!contentState.hasText()) {
            if (contentState.getBlockMap().first().getType() !== 'unstyled') {
              className += ' RichEditor-hidePlaceholder';
            }
          }

          return (
            <div className="RichEditor-root">
              <BlockStyleControls
                editorState={editorState}
                onToggle={this.toggleBlockType}
              />
              <InlineStyleControls
                editorState={editorState}
                onToggle={this.toggleInlineStyle}
              />
              <div className={className} onClick={this.focus}>
                <Editor
                  blockStyleFn={getBlockStyle}
                  customStyleMap={styleMap}
                  editorState={editorState}
                  handleKeyCommand={this.handleKeyCommand}
                  keyBindingFn={this.mapKeyToEditorCommand}
                  onChange={this.onChange}
                  placeholder="Tell a story..."
                  ref="editor"
                  spellCheck={false}
                />
              </div>
            </div>
          );
        }
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

      function getBlockStyle(block) {
        switch (block.getType()) {
          case 'blockquote': return 'RichEditor-blockquote';
          default: return null;
        }
      }

export default RichEditor;