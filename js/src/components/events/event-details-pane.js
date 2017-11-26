import React, { Component }  from 'react';
import Time from 'react-time';
import {Card} from '@blueprintjs/core';
import '../../../node_modules/@blueprintjs/core/dist/blueprint.css';
import '../../stylesheet.css';

export default class EventDetailsPane extends Component {

	getMinPrice() {
      if (this.props.event.minPrice !== 'None') {
        return "Tickets starting at $" + this.props.event.minPrice;
      }
    }

	render() {
		var detailsClass = "eventDetailCard";
    const id = "event"+this.props.event.id;
    var elevation = 0;
		if (this.props.selectedEvent 
			&& this.props.selectedEvent.id === this.props.event.id) {
			detailsClass = "eventDetailCardSelected";
      elevation = 4;
		} 
		return (
          <div id={id} className={detailsClass}
            onClick={this.props.eventSelected.bind(this, this.props.event)}>
            <Card interactive={true} elevation={elevation}>
            <h4 className="eventDetailsHeader">
                {this.props.event.awayTeam} vs. {this.props.event.homeTeam}</h4>
            <h5 className="eventDetailsDate"><Time value={this.props.event.start} format="dddd, MMMM Do"/></h5>
            <p className="eventDetailsContent">Tip-off at <Time value={this.props.event.start}
               format="h:mmA" /><br />
              {this.props.event.numTickets} tickets available <br />
              {this.getMinPrice()}</p>
            </Card>
          </div>
        );
	}
}
