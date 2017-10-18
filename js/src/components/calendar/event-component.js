import React, { Component }  from 'react';

export default class EventComponent extends Component {

  render() {
    return (
    	<p>{this.props.event.title}</p>
    );
  }
}