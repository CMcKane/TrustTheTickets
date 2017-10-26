import React, { Component }  from 'react';
import './event-details.css';

export default class EventDetails extends Component {

    getEventDetails() {
      if (this.props.populated) {
        return (
          <div className="event-detail-pane">
            <h4>{this.props.home} vs. {this.props.away}</h4>
            <p>Tip-off at {this.props.gameTime}</p>
            {this.getMinPrice()}
            <p>{this.props.numTickets} tickets available</p>
          </div>
        );
      } else return (<div>No game selected</div>)
    }

    getMinPrice() {
      if (this.props.minPrice !== 'None') {
        return (<p>Tickets starting at ${this.props.minPrice}</p>);
      }
    }

    render() {
      if (this.props.event !== null) {
        this.getEventDetails();
      }
      return (
          <div className="event-detail-container">
            <h3 className="text-center">Game Details</h3>
            {this.getEventDetails()}
          </div>
      );
    }
}
