import React, { Component }  from 'react';
import EventCalendar from '../calendar/calendar';
import { Well } from 'react-bootstrap';
import './event-calendar-view.css';

const games = [
{
    end: 'Tue Oct 17 2017 18:00:00 GMT-0400 (EDT)',
    start: 'Tue Oct 17 2017 21:00:00 GMT-0400 (EDT)',
    title: 'Sixers vs Grizzlies',
    homeTeam: '76ERS',
    awayTeam: 'GRIZZLIES',
    id: 1
},
{
    end: 'Fri Oct 20 2017 18:00:00 GMT-0400 (EDT)',
    start: 'Fri Oct 20 2017 21:00:00 GMT-0400 (EDT)',
    title: 'Sixers vs Cavaliers',
    homeTeam: '76ERS',
    awayTeam: 'CAVALIERS',
    id: 2
}
]

export default class EventCalendarView extends Component {

    getEvents() {
        return games;
    }

    rerouteToSeatingChart(eventID) {
        this.props.history.push('/pick-tickets?event=' + eventID);
    }

    render() {
        return (
            <div className="eventCalendarView">
                <Well className="events-well"> Choose Your Game </Well>
                <EventCalendar events={this.getEvents()} eventSelected={this.rerouteToSeatingChart.bind(this)}/>
            </div>
        )
    }
}