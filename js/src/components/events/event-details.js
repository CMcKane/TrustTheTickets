import React, { Component }  from 'react';
import EventDetailsPane from './event-details-pane';
import _ from 'lodash';
import './event-details.css';

export default class EventDetails extends Component {

    constructor(props) {
      super(props);

      this.state = {
        eventList: this.props.eventList
      };
    }

    renderEventDetails() {
        return _.map(this.state.eventList, (event, index) => 
            <EventDetailsPane
            key={event.id}
            event={event}
            selectedEvent={this.props.selectedEvent}
            eventSelected={this.props.eventSelected} />
        );
    }

    render() {
      return (
          <div>
            <h3 className="text-center">Game Details</h3>
            <div className="event-detail-container">
              {this.renderEventDetails()}
            </div>
          </div>
      );
    }
}
