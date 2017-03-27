/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable comma-dangle */

import React, {Component} from 'react';
import {
  convertToRaw,
  Editor, // The actual editor
  EditorState, // Editor initial state
  RichUtils, // So we can bind commands like Cmd+B for bold text
  Modifier,
  CompositeDecorator,
} from 'draft-js';
import PowerWord from './PowerWord.jsx';


export default class App extends Component {

  constructor( props ) {
    super( props );

    // Decorate entities...
    // This is executed everytime a record is rendered
    this._powerWordStrategy = (contentBlock, callback, contentState) => {
      const text = contentBlock.getText();
      contentBlock.findEntityRanges(
        (character) => {
          const entityKey = character.getEntity();
          const result = entityKey !== null
          return result;
        },
        callback
      );
    };

    const decorator = new CompositeDecorator( [ {
      strategy: this._powerWordStrategy,
      component: PowerWord,
    } ] );
    

    // Default state
    this.state = {
      editorState: EditorState.createEmpty( decorator ),
      inputValue: '',
    };

    // Handle input field changes and update state.
    this.onInputChange = ( e ) => {
      this.setState( {
        inputValue: e.target.value
      } );
    }

    // Set the focus to the editor
    this.focus = () => {
      this.editor.focus();
    }

    // Handle onChange
    this.onChange = ( editorState ) => {
      this.setState( { editorState } );
    }

    // Handle key commands
    this.handleKeyCommand = ( command ) => {
      console.info( 'Key command', command );
      const newState = RichUtils.handleKeyCommand( this.state.editorState, command );
      if (newState ) {
        this.onChange( newState );
      }
    }

    // Example of inline style toggle...
    this.onBold = ( event ) => {
      const newState = RichUtils.toggleInlineStyle( this.state.editorState, 'BOLD' );
       if (newState ) {
        this.onChange( newState );
      }
    }

    // Log the content state
    this.logState = () => {
      const content = this.state.editorState.getCurrentContent();
      console.info( convertToRaw(content) );
    };

    // This a generic function to create a new EditorState
    // with an Entity attached to it.
    this.addEntity = (
      {type, mutability, data},
      editorState,
      selection = editorState.getSelection(),
      contentState = editorState.getCurrentContent()
    ) => {
      const contentStateWithEntity = contentState.createEntity(type, mutability, data)
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
      const contentStateWithEntityApplied = Modifier.applyEntity(contentStateWithEntity, selection, entityKey)
      const editorStateWithEntity = EditorState.push(editorState, contentStateWithEntityApplied, 'apply-entity')
      return editorStateWithEntity
    }

    // Attach description to selected text
    this.attachPowerWord = () => {
      // Create a new EditorState with an Entity
      // attached to it (using our entity factory function)
      const newEditorState = this.addEntity(
        { // Metadata assigned to our entity
          type: 'POWER_WORD', 
          mutability: 'IMMUTABLE', 
          data: { description: this.state.inputValue }
        },
        this.state.editorState
      );

      // Update our state with the new EditorState
      // we just created
      this.onChange( newEditorState );
    }

  } // end constructor


  render() {
    return (
      <div className='container'>


        <div className='power-word row col-sm-7 input-group'>
          <input
            type='text'
            className='form-control form-control-sm'
            onChange={ this.onInputChange }
            value={ this.state.inputValue }
            placeholder='Description...'
          />
          <span className="input-group-btn">
            <button
              className='btn btn-success btn-sm'
              onClick={ this.attachPowerWord }
            >
              Add to selection
            </button>
          </span>
        </div>

        
        <div
          className='editor-wrapper'
          onClick={ this.focus }
        >
          <Editor
            className='form-control'
            editorState={ this.state.editorState }
            onChange={ this.onChange }
            handleKeyCommand={ this.handleKeyCommand }
            placeholder='Write something...'
            ref={ ( editor ) => this.editor = editor }
          />
        </div>


        <button
          className='btn btn-primary btn-sm'
          onClick={ this.logState } >Log State
        </button>

      </div>
    );
  }
}