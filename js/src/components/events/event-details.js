import React, { Component }  from 'react';
import EventDetailsPane from './event-details-pane';
import _ from 'lodash';
import './event-details.css';

export default class EventDetails extends Component {

    renderEventDetails() {
        return _.map(this.props.eventList, (event, index) => 
            <EventDetailsPane
            key={event.id}
            event={event}
            selectedEvent={this.props.selectedEvent}
            eventSelected={this.props.eventSelected} />
        );
    }

    render() {
      return (
          <div className="event-details-container">
            <h3 className="text-center details-header">Game Details</h3>
            <div className="event-details">
              {this.renderEventDetails()}
            </div>
          </div>
      );
    }
}
