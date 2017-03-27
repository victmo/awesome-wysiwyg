/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable comma-dangle */

import React, {Component} from 'react';

export default class PowerWord extends Component {

  constructor( props ) {
    super( props );

    this.description = 'Loading...'

    // Default state
    this.state = {
      showDescription: false,
    };

    this.onOver = () => {
      this.setState({
        showDescription: true,
      });
    }

    this.onOut = () => {
      this.setState({
        showDescription: false,
      });
    }

  } // end constructor


  componentDidMount() {
    const { description } = this.props.contentState.getEntity(this.props.entityKey).getData();
    this.description = description;
  }


  render() {
    return (
      <span
        className='power-word'
        onMouseOver={ this.onOver }
        onMouseOut={ this.onOut }
      >
        { this.props.children }
        {
          this.state.showDescription ?
            <div className='power-word-description'>{ this.description }</div> :
            null
        }
      </span>
    );
  }
}