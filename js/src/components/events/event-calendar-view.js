import React, { Component }  from 'react';
import EventCalendar from '../calendar/calendar';
import { Well, Row, Col, Button } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import EventDetails from './event-details';
import moment from 'moment';
import { TTTPost } from '../backend/ttt-request';
import './event-calendar-view.css';

export default class EventCalendarView extends Component {

    constructor(props) {
      super(props);

      this.state = {
        selectedEvent: null,
        eventList: []
      };
    }

    getEvents(date, view) {
        const start = moment(date).startOf('month').format('YYYY-MM-DD HH:mm:ss');
        const end = moment(date).endOf('month').format('YYYY-MM-DD HH:mm:ss');
        TTTPost('/ticket-details', {
            start: start,
            end: end
        }).then(res => {
            if (res.data.eventDetails) {
                this.setState({
                    eventList: res.data.eventDetails
                });
            }
        });
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
                        <EventCalendar events={this.state.eventList} eventSelected={this.eventSelected.bind(this)}
                            selected={this.state.selectedEvent}
                            onNavigate={this.getEvents.bind(this)} />
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
        );
    }
}