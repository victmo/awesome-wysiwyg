import React, { Component } from 'react';
import { Editor, EditorState } from 'draft-js';

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
  }

  render() {
    return (
      <div>
        <h1>TFK Editor</h1>
        
        <div style={ { border: '1px solid #ddd' } }>
          <Editor
            editorState={ this.state.editorState }
            onChange={ this.onChange }
          />
        </div>

        <button onClick={ this.onSetCustomState } >Set custom state</button>
      </div>
    );
  }
}
