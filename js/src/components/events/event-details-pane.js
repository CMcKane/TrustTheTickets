import React, { Component }  from 'react';

export default class EventDetailsPane extends Component {

	getMinPrice() {
      if (this.props.event.minPrice !== 'None') {
        return (<p>Tickets starting at ${this.props.event.minPrice}</p>);
      }
    }

	render() {
		var detailsClass = "event-detail-pane";
		if (this.props.selectedEvent 
			&& this.props.selectedEvent.id === this.props.event.id) {
			detailsClass = "event-detail-pane-selected";
		} 
		return (
          <div className={detailsClass} onClick={this.props.eventSelected.bind(this, this.props.event)}>
            <h4>{this.props.event.homeTeam} vs. {this.props.event.awayTeam}</h4>
            <p>Tip-off at {this.props.event.startDate}</p>
            {this.getMinPrice()}
            <p>{this.props.event.numTickets} tickets available</p>
          </div>
        );
	}
}
