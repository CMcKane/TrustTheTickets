import React, { Component }  from 'react';
import EventDetailsPane from './event-details-pane';
import _ from 'lodash';

export default class EventDetails extends Component {

    renderEventDetails(eventList) {
        return _.map(eventList, (event, index) => 
            <EventDetailsPane
            key={event.id}
            event={event}
            selectedEvent={this.props.selectedEvent}
            eventSelected={this.props.eventSelected} />
        );
    }

    componentDidUpdate() {
      if (window.innerWidth <= 767 && this.props.selectedEvent) {
        var rightPos = document.getElementById('event'+this.props.selectedEvent.id).offsetLeft;
        document.getElementById('event-details').scrollLeft = rightPos-75;
      } else if (this.props.selectedEvent) {
          var topPos = document.getElementById('event'+this.props.selectedEvent.id).offsetTop;
          document.getElementById('event-details').scrollTop = topPos-75;
        }
    }

    render() {
      return (
          <div className="eventDetailsContainer">
            <h3 className="gameDetailsHeader">Game Details</h3>
            <div id="event-details" className="eventDetails">
              {this.renderEventDetails(this.props.eventList)}
            </div>
          </div>
      );
    }
}
