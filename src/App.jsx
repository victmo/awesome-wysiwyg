import React, { Component } from 'react';
import { Editor, EditorState } from 'draft-js';

class App extends Component {

constructor( props ) {
  super( props );
  this.state = {
    editorState: EditorState.createEmpty()
  };
  
  this.onChange = ( editorState ) => {
    this.setState( { editorState } );
  }
}


  render() {
    return (
      <div>
        <h1>TfK Editor</h1>
        <div style={ { border: '1px solid #ddd' } }>
          <Editor 
            editorState={ this.state.editorState } 
            onChange={ this.onChange } 
          />
        </div>
      </div>
    );
  }
}
export default App;
