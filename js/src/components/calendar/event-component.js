import React, { Component }  from 'react';
import Logo from '../logos/logo';

/**
* This class is the main event component class used for showing the away team logo.
*/
export default class EventComponent extends Component {

    /**
    * Main rendering loop.
    */
  render() {
    return (
    	<div className="calendarEventComponentContainer">
    		<Logo team={this.props.event.awayTeam} svg={true} class={"teamLogo"} />
    	</div>
    );
  }
}