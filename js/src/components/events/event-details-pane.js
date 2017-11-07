import React, { Component }  from 'react';
import Time from 'react-time';
import './event-details.css';

export default class EventDetailsPane extends Component {

	getMinPrice() {
      if (this.props.event.minPrice !== 'None') {
        return "Tickets starting at $" + this.props.event.minPrice;
      }
    }

	render() {
		var detailsClass = "event-detail-pane";
    const id = "event"+this.props.event.id;
		if (this.props.selectedEvent 
			&& this.props.selectedEvent.id === this.props.event.id) {
			detailsClass = "event-detail-pane-selected";
		} 
		return (
          <div id={id}
            className={detailsClass} 
            onClick={this.props.eventSelected.bind(this, this.props.event)}>
            <h4 className="event-details-header">
                {this.props.event.homeTeam} vs. {this.props.event.awayTeam}</h4>
            <h5 className="event-details-date"><Time value={this.props.event.start} format="dddd, MMMM Do"/></h5>
            <p className="event-details-content">Tip-off at <Time value={this.props.event.start}
               format="h:mmA" /><br />
              {this.props.event.numTickets} tickets available <br />
              {this.getMinPrice()}</p>
          </div>
        );
	}
}
