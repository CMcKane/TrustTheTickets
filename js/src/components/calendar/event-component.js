import React, { Component }  from 'react';
import Logo from '../logos/logo';
import "./calendar.css";

export default class EventComponent extends Component {

  render() {
    return (
    	<div className="eventComponentContainer">
    		<Logo team={this.props.event.awayTeam} />
    	</div>
    );
  }
}