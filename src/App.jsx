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


    // Default state
    this.state = {
      editorState: EditorState.createEmpty(),
      showDescriptionInput: false,
      descriptionValue: ''
    };

    this.logState = () => {
      const content = this.state.editorState.getCurrentContent();
      console.log( convertToRaw(content) );
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

    // Log the text
    this.logState = () => {
      const content = this.state.editorState.getCurrentContent();
      console.info(Date().toString(), convertToRaw(content) );
    };

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

    // binding function to show field for definition
    this.promptForDefinition = this.promptForDefinition.bind(this);
    // setting description from input field
    this.onDecriptionChange = (e) => this.setState({descriptionValue: e.target.value});

    // function to show field for definition
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

    // function to turn selected word into entity and to apply description entered as data
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


    // // Custom entity
    // this.createEntity = () => {
    //   const ts = Date().toString();

    //   // Get a reference to the actual content of my Editable
    //   const contentState = this.state.editorState.getCurrentContent();

    //   // Create an Entity (we haven't assined it yet)
    //   const contentStateWithEntity = contentState.createEntity(
    //     'POWER_WORD',
    //     'MUTABLE',
    //     { description: `Lorem ipsum ${ Date().toString() }` }
    //   );

    //   // Get the Entity's key (name)
    //   const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    //   console.info( 'Entity key:', entityKey );

    //   // Get the current selection as a state
    //   const selectionState = this.state.editorState.getSelection();
    //   console.info( 'selectionState', selectionState );

    //   const contentStateWithLink = Modifier.applyEntity(
    //     contentState,
    //     selectionState,
    //     entityKey
    //   );
    // }

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
