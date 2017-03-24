import React, {Component} from 'react';
import {
  convertToRaw,
  CompositeDecorator,
  ContentState,
  Editor,
  EditorState,
  RichUtils,
} from 'draft-js';

// const styles = {
//   mutable: {
//     backgroundColor: 'rgba(204, 204, 255, 1.0)',
//     padding: '2px 0'
//   }
// };

const styleMap = {
  'HIGHLIGHT': {
    backgroundColor: 'lightgreen'
   }
};
export default class App extends Component {

  constructor( props ) {
    super( props );

    this.state = {
      editorState: EditorState.createEmpty(),
      showDescriptionInput: false,
      descriptionValue: ''
    };

    this.logState = () => {
      const content = this.state.editorState.getCurrentContent();
      console.log( convertToRaw(content) );
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
      const newState = RichUtils.handleKeyCommand( this.state.editorState, command );
      if ( newState ) {
        this.onChange( newState );
        return 'handled';
      }
    }

    this.promptForDefinition = (e) => {
       e.preventDefault();

    }

    this.promptForDefinition = this.promptForDefinition.bind(this);
    this.onDecriptionChange = (e) => this.setState({descriptionValue: e.target.value});
      // if ( 'bold' === command ) {
        // if using setState outside of onChange, must pass state as editorState named state prop
        // which this.state is expecting to update the state
        // const editorState = RichUtils.toggleInlineStyle( this.state.editorState, 'BOLD' );
        // if (editorState) {
        //   this.setState( { editorState } );
        //   return 'handled';
        // }

        // const newState = RichUtils.toggleInlineStyle( this.state.editorState, 'BOLD' );
        // if ( newState ) {
        //   this.onChange( { newState } );
        //   return 'handled';
        // }
      // }

    this.promptForDefinition = (e) => {
      e.preventDefault();
      const {editorState} = this.state;
      const selection = editorState.getSelection();
      if (!selection.isCollapsed()) {
        const contentState = editorState.getCurrentContent();
        const startKey = editorState.getSelection().getStartKey();
        const startOffset = editorState.getSelection().getStartOffset();
        const blockWithDescriptionAtBeginning = contentState.getBlockForKey(startKey);
        const decriptionKey = blockWithDescriptionAtBeginning.getEntityAt(startOffset);

        let description = '';
        if (decriptionKey) {
          const descriptionInstance = contentState.getEntity(decriptionKey);
          description = descriptionInstance.getData().description;
        }

        this.setState({
          showDescriptionInput: true,
          descriptionValue: description
        });
      }
    }

    this.confirmDescription = (e) => {
      e.preventDefault();
      const {editorState, descriptionValue} = this.state;
      const contentState = editorState.getCurrentContent();
      const contentStateWithEntity = contentState.createEntity(
        'POWER_WORD',
        'MUTABLE',
        {description: descriptionValue}
      );
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
      this.setState({
        editorState: RichUtils.toggleLink(
          newEditorState,
          newEditorState.getSelection(),
          entityKey
        ),
        showDescriptionInput: false,
        descriptionValue: ''
      });
    }


    // custom mapped bold button
    this.onBold = ( event ) => {
      const newState = RichUtils.toggleInlineStyle( this.state.editorState, 'BOLD' );
      if ( newState ) {
        this.onChange( newState );
        return 'handled';
      }
    }

    this.createEntity=() => {
      const {editorState} = this.state;
      const currentContent = this.state.editorState.getCurrentContent();

      const contentStateWithEntity = currentContent.createEntity('POWER_WORD', 'MUTABLE', {description: ''})
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

      const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });

      this.setState({
        editorState: RichUtils.toggleInlineStyle(
            newEditorState,
            'HIGHLIGHT',
            newEditorState.getSelection(),
            entityKey
          )
      });

    }

    this.onDescriptionInputKeyDown = (e) => {
      if (e.which === 13) {
        this.confirmDescription(e);
      }
    }


  }

  render() {
    let descriptionInput;
    if (this.state.showDescriptionInput) {
      descriptionInput =
        <div>
          <input
            onChange={this.onDecriptionChange}
            ref="description"
            type="text"
            value={this.state.descriptionValue}
            onKeyDown={this.onDescriptionInputKeyDown}
            />
          <button onMouseDown={this.confirmDescription}>
            Add Description
          </button>
        </div>;
    }

    return (
      <div>
        <h1>TFK Editor</h1>

        <div style={ { border: '1px solid #ddd' } }>
          <Editor
            editorState={ this.state.editorState }
            onChange={ this.onChange }
            handleKeyCommand={ this.handleKeyCommand }
            customStyleMap={styleMap}
          />
        </div>

        <button onClick={ this.onSetCustomState } >Set custom state</button>

        <button onClick={ this.logState }> Log State </button>
        <button onClick={ this.onBold } >Bold</button>
        <button onClick={ this.createEntity }> Create Entity </button>
        <button
          onMouseDown={this.promptForDefinition}
          style={{marginRight: 10}}>
          Add Description
        </button>

        {descriptionInput}

      </div>
    );
  }
}
