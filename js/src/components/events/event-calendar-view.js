import React, { Component }  from 'react';
import EventCalendar from '../calendar/calendar';
import { Well, Row, Col, Button } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import EventDetails from './event-details';
import { TTTPost } from '../backend/ttt-request';
import './event-calendar-view.css';

const games = [
{
    end: 'Tue Oct 17 2017 18:00:00 GMT-0400 (EDT)',
    start: 'Tue Oct 17 2017 18:00:00 GMT-0400 (EDT)',
    gameTime: 'Tue Oct 17 2017 18:00:00 GMT-0400 (EDT)',
    title: 'Sixers vs Grizzlies',
    home: 'Philadelphia 76ers',
    away: 'Memphis Grizzlies',
    numTickets: '',
    minPrice: '',
    id: 13
},
{
    end: 'Fri Oct 20 2017 18:00:00 GMT-0400 (EDT)',
    start: 'Fri Oct 20 2017 18:00:00 GMT-0400 (EDT)',
    gameTime: 'Fri Oct 20 2017 18:00:00 GMT-0400 (EDT)',
    title: 'Sixers vs Celtics',
    home: 'Philadelphia 76ers',
    away: 'Boston Celtics',
    numTickets: '',
    minPrice: '',
    id: 20
}
]

export default class EventCalendarView extends Component {

    constructor(props) {
      super(props);

      this.state = {
        selectedEvent: null,
        eventList: this.getEvents(),
      };
    }

    getEvents() {
        // Want to make API call to get events here
        return games;
    }

    getRedirect() {
        return '/pick-tickets?event=' + this.state.selectedEvent.id;
    }

    eventSelected(event) {
        this.setState({
            selectedEvent: event
        })
    }

    onSubmit() {
        if (this.state.selectedEvent) {
            this.setState({
                redirect: true
            });
        }
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.getRedirect()} />
        }
        else return (
            <div className="eventCalendarView">
                <Well className="events-well"> Choose Your Game </Well>
                    <Col lg={9} className="eventCalendarView">
                        <EventCalendar events={this.getEvents()} eventSelected={this.eventSelected.bind(this)}
                            selected={this.state.selectedEvent} />
                    </Col>
                    <Col lg={3}>
                        <Row>
                        <EventDetails eventList={this.state.eventList} selectedEvent={this.state.selectedEvent}
                            eventSelected={this.eventSelected.bind(this)} />
                        </Row>
                        <Row style={{'textAlign': 'center'}}>
                                <Button bsStyle="primary"
                                    onClick={this.onSubmit.bind(this)}>
                                    See Tickets
                                </Button>
                        </Row>
                    </Col>
            </div>
        )
    }
}