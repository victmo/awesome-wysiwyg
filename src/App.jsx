import React, {Component} from 'react';
import {
  Editor,
  EditorState,
  RichUtils
} from 'draft-js';

export default class App extends Component {

  constructor( props ) {
    super( props );

    this.state = {
      editorState: EditorState.createEmpty()
    };

    this.onChange = ( editorState ) => {
      this.setState( { editorState } );
    }

    this.onSetCustomState = ( event ) => {
      const myState = { hi: 'Vic' };
      console.info( 'Custom state!', myState );
    }

    this.handleKeyCommand = ( command ) => {
      console.info( command );

      if ( 'bold' === command ) {
        // if using setState outside of onChange, must pass state as editorState named state prop
        // which this.state is expecting to update the state
        // const editorState = RichUtils.toggleInlineStyle( this.state.editorState, 'BOLD' );
        // if (editorState) {
        //   this.setState( { editorState } );
        //   return 'handled';
        // }

        const newState = RichUtils.toggleInlineStyle( this.state.editorState, 'BOLD' );
        if ( newState ) {
          this.onChange( { newState } );
          return 'handled';
        }
      }
    }

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
