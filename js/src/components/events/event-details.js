import React, { Component }  from 'react';

export default class EventDetails extends Component {

    getEventDetails() {
      if (this.props.populated) {
        return (
          <div>
            <h4>{this.props.home} vs. {this.props.away}</h4>
            <p>Tip-off at {this.props.gameTime}</p>
            <p>Tickets starting at {this.props.minPrice}</p>
            <p>{this.props.numTickets} tickets available</p>
          </div>
        );
      } else return (<div>No game selected</div>)
    }

    render() {
      if (this.props.event !== null) {
        this.getEventDetails();
      }
      return (
          <div style={{color: "black"}}>
            <h3 className="text-center">Game Details</h3>
            {this.getEventDetails()}
          </div>
      );
    }
}
