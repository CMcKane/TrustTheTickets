import React, { Component }  from 'react';
import EventCalendar from '../calendar/calendar';
import { Well, Row, Col, Button } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import EventDetails from './event-details';
import moment from 'moment';
import { TTTPost } from '../backend/ttt-request';
import queryString from 'query-string';
import {withRouter} from "react-router-dom";
import './event-calendar-view.css';

class EventCalendarView extends Component {

    constructor(props) {
      super(props);
      
      this.getEvents(new Date(), null);
      
      this.state = {
        selectedEvent: null,
        eventList: []
      };
    }

    getEvents(date, view) {
        const start = moment(date).startOf('month').format('YYYY-MM-DD HH:mm:ss');
        const end = moment(date).endOf('month').format('YYYY-MM-DD HH:mm:ss');
        if (this.monthAndYearValid(date.getMonth(), date.getFullYear())) {
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
            this.props.history.push(this.getDateRedirect(date.getMonth(), 
                date.getFullYear()));
        }
    }

    getRedirect() {
        return ('/pick-tickets?event=' + this.state.selectedEvent.id);
    }

    getDateRedirect(currMonth, currYear) {
        return ('/event-calendar?m=' + currMonth + '&y=' + currYear);
    }

    eventSelected(event) {
        if (this.state.selectedEvent 
            && (event.id === this.state.selectedEvent.id)) {
            this.setState({
                selectedEvent: null
            });
        } else {
            this.setState({
                selectedEvent: event
            });
        }
    }

    onSubmit() {
        if (this.state.selectedEvent) {
            this.setState({
                redirect: true
            });
        }
    }

    monthAndYearValid(qMonth, qYear) {
        const currMonth = new Date().getMonth();
        const currYear = new Date().getFullYear();
        if (qMonth !== null && qYear !== null) {
            // check if integers
            if (qMonth % 1 === 0 && qYear % 1 === 0) {
                if (qMonth >=0 && qMonth <= 11) {
                    if ((qYear == currYear && qMonth >= currMonth) || (qYear == currYear + 1)) {
                        return true;
                    }
                }
            }
        }
    }

    render() {
        const queryParams = queryString.parse(this.props.location.search);
        const currMonth = new Date().getMonth();
        const currYear = new Date().getFullYear();
        if (!this.monthAndYearValid(queryParams.m, queryParams.y)) {
            this.props.history.push(this.getDateRedirect(currMonth, currYear));
        }
        if (this.state.redirect) {
            return <Redirect to={this.getRedirect()} />
        } 
        else return (
            <div className="eventCalendarView">
                <Well className="events-well"> Choose Your Game </Well>
                    <Col lg={9} className="eventCalendarView">
                        <EventCalendar events={this.state.eventList} 
                            eventSelected={this.eventSelected.bind(this)}
                            selected={this.state.selectedEvent}
                            onNavigate={this.getEvents.bind(this)}
                            month={queryParams.m}
                            year={queryParams.y} />
                    </Col>
                    <Col lg={3}>
                        <Row>
                        <EventDetails
                            eventList={this.state.eventList} 
                            selectedEvent={this.state.selectedEvent}
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
export default withRouter(EventCalendarView);
