/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable comma-dangle */

import React, {Component} from 'react';
import {
  Editor, // The actual editor
  EditorState, // Editor initial state
  RichUtils, // So we can bind commands like Cmd+B for bold text
} from 'draft-js';


export default class App extends Component {

  constructor( props ) {
    super( props );


    // Default state
    this.state = {
      editorState: EditorState.createEmpty()
    };


    // 
    this.onChange = ( editorState ) => {
      this.setState( { editorState } );
    }



    this.handleKeyCommand = ( command ) => {
      console.info( command );

      // Manually bolding
      if( command === 'bold' ){
        const newState = RichUtils.toggleInlineStyle( this.state.editorState, 'BOLD' );
        this.onChange( newState );
        //this.setState( { editorState: newState } ); // or set it directly
      }
    }

    // this.onSetCustomState = ( event ) => {
    //   const myState = { hi: 'Vic' };
    //   console.info( 'Custom state!', myState );
    // }
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

        <button onClick={ this.onSetCustomState } >Set custom state</button>

      </div>
    );
  }
}