import React, { Component }  from 'react';
import EventDetailsPane from './event-details-pane';
import _ from 'lodash';

/**
* This class renders each event detail box in the event details pane.
*/
export default class EventDetails extends Component {

    /**
    * Creates a map with the event details for the selected event.
    * @param eventList - the event list of events.
    */
    renderEventDetails(eventList) {
        return _.map(eventList, (event, index) => 
            <EventDetailsPane
            key={event.id}
            event={event}
            selectedEvent={this.props.selectedEvent}
            eventSelected={this.props.eventSelected} />
        );
    }

    /**
    * Triggered when page starts.
    */
    componentDidUpdate() {
      if (window.innerWidth <= 767 && this.props.selectedEvent) {
        var rightPos = document.getElementById('event'+this.props.selectedEvent.id).offsetLeft;
        document.getElementById('event-details').scrollLeft = rightPos-75;
      } else if (this.props.selectedEvent) {
          var topPos = document.getElementById('event'+this.props.selectedEvent.id).offsetTop;
          document.getElementById('event-details').scrollTop = topPos-75;
        }
    }

    /**
    * Main rendering loop.
    */
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
