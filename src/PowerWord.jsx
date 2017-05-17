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

    this.onOver = (e) => {
      e.stopPropagation();
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
    //const { description } = this.props.contentState.getEntity(this.props.entityKey).getData();
    this.description =  this.props.node.data.get('description');
  }


  render() {
    const { attributes, children } = this.props;
    console.log(this.props)
    return (
      <span
        className={`power-word ${ this.state.showDescription ? 'active': '' }`}
        style={{ textDecoration: this.state.showDescription ? 'underline': '' }}
        onMouseOver={ this.onOver }
        onMouseOut={ this.onOut }
        { ...attributes }
      >
        { children }
        {
          this.state.showDescription ?
            <div className='power-word-description'>{ this.description }</div> :
            null
        }
      </span>
    );
  }
}