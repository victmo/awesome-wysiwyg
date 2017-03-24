/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable comma-dangle */

import React, {Component} from 'react';
import {
  convertToRaw,
  Editor, // The actual editor
  EditorState, // Editor initial state
  RichUtils, // So we can bind commands like Cmd+B for bold text
  Modifier
} from 'draft-js';


export default class App extends Component {

  constructor( props ) {
    super( props );


    // Default state
    this.state = {
      editorState: EditorState.createEmpty()
    };


    // Handle onChange
    this.onChange = ( editorState ) => {
      this.setState( { editorState } );
    }


    // Handle key commands
    this.handleKeyCommand = ( command ) => {
      console.info( command );
      const newState = RichUtils.handleKeyCommand( this.state.editorState, command );
      if (newState ) {
        this.onChange( newState );
      }
    }


    // Custom button
    this.onBold = ( event ) => {
      const newState = RichUtils.toggleInlineStyle( this.state.editorState, 'BOLD' );
       if (newState ) {
        this.onChange( newState );
      }
    }


    // Custom entity
    this.createEntity = () => {
      const ts = Date().toString();
      
      // Get a reference to the actual content of my Editable
      const contentState = this.state.editorState.getCurrentContent();
      
      // Create an Entity (we haven't assined it yet)
      const contentStateWithEntity = contentState.createEntity(
        'POWER_WORD',
        'MUTABLE',
        { description: `Lorem ipsum ${ Date().toString() }` }
      );

      // Get the Entity's key (name)
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      console.info( 'Entity key:', entityKey );
      
      // Get the current selection as a state
      const selectionState = this.state.editorState.getSelection();
      console.info( 'selectionState', selectionState );

      const contentStateWithLink = Modifier.applyEntity(
        contentState,
        selectionState,
        entityKey
      );
    }

    // Log the text
    this.logState = () => {
      const content = this.state.editorState.getCurrentContent();
      console.info(Date().toString(), convertToRaw(content) );
   };
  }


  render() {
    return (
      <div>
        <h1>TFK Editor</h1>
        
        <div style={ { border: '1px solid #ddd' } }>
          <Editor
            editorState={ this.state.editorState }
            onChange={ this.onChange }
            handleKeyCommand={ this.handleKeyCommand }
          />
        </div>

        <button onClick={ this.onBold } >Boldify!</button>
        <button onClick={ this.createEntity } >Entitify!</button>
        <button onClick={ this.logState } >Log State!</button>

      </div>
    );
  }
}