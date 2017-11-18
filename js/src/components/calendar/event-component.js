import React, { Component }  from 'react';
import Logo from '../logos/logo';
import '../../stylesheet.css';

export default class EventComponent extends Component {

  render() {
    return (
    	<div className="calendarEventComponentContainer">
    		<Logo team={this.props.event.awayTeam} svg={true} class={"teamLogo"} />
    	</div>
    );
  }
}