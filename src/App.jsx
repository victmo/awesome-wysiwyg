/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable comma-dangle */

import React, {Component} from 'react';
import { Editor, Raw } from 'slate'
import PowerWord from './PowerWord.jsx';

const schema = {
  nodes: {
    'power-word': PowerWord,
  },
}

const initialState = {
  nodes: [
    {
      kind: 'block', type: 'paragraph',
      nodes: [
        {
          kind: 'text', text: 'Lorem ipsum!',
        },
      ],
    },
  ],
}

export default class App extends Component {

  constructor( props ) {
    super( props );

    // Default state
    this.state = {
      state: Raw.deserialize(initialState, { terse: true }),
      inputValue: 'This is a random power word definition.',
    };

    // Handle onChange
    this.onChange = (state) => {
      this.setState({ state })
    }

    // Log the content state
    this.logState = () => {
      const content = Raw.serialize( this.state.state );
      console.info( content );
    };




    // Set the focus to the editor
    this.focus = () => {
      // this.editor.focus();
    }

    // Powerword input _____________

    // Handle input field changes and update state.
    this.onInputChange = ( e ) => {
      this.setState( {
        inputValue: e.target.value
      } );
    }

    this.attachPowerWord = () => {
      console.info(`Attaching ${ this.state.inputValue }`);
      const newState = this.state.state
        .transform()
        .wrapInline({
          type: 'power-word',
          //isVoid: true,
          data: { description: this.state.inputValue }
        })
        .collapseToEnd()
        .apply()
      ;



      this.onChange(newState);
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
            state={ this.state.state }
            schema={schema}
            onChange={ this.onChange }
          />
        </div>


        <button
          className='btn btn-primary btn-sm'
          onClick={ this.logState } >Log State
        </button>

        <pre>{ JSON.stringify( Raw.serialize( this.state.state ), 2, 2 ) }</pre>

      </div>
    );
  }
}