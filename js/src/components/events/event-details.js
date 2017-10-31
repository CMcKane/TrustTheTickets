import React, { Component }  from 'react';
import EventDetailsPane from './event-details-pane';
import _ from 'lodash';
import './event-details.css';

export default class EventDetails extends Component {

    renderEventDetails(eventList) {
      console.log(eventList);
        return _.map(eventList, (event, index) => 
            <EventDetailsPane
            key={event.id}
            event={event}
            selectedEvent={this.props.selectedEvent}
            eventSelected={this.props.eventSelected} />
        );
    }

    // Convoluted spaghetti code courtesy of Tom
    sortEventList() {
      if (this.props.selectedEvent) {
        var eventList = [];
        eventList[0] = this.props.selectedEvent;
        var counter = 0;
        for (var i = 1; i < this.props.eventList.length+1; i++) {
          if (this.props.eventList[i-1] !== this.props.selectedEvent)
            eventList[i-counter] = this.props.eventList[i-1];
          else {
            counter++;
          }
        }
        return eventList;
      }
      return this.props.eventList;
    }

    render() {
      const eventList = this.sortEventList();
      return (
          <div className="event-details-container">
            <h3 className="text-center details-header">Game Details</h3>
            <div className="event-details">
              {this.renderEventDetails(eventList)}
            </div>
          </div>
      );
    }
}
