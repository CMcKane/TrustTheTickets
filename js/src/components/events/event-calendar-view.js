import React, { Component }  from 'react';
import EventCalendar from '../calendar/calendar';
import { Well, Row, Col, Button } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import EventDetails from './event-details';
import moment from 'moment';
import { TTTPost } from '../backend/ttt-request';
import queryString from 'query-string';
import {withRouter} from "react-router-dom";

/**
* This class is used for the calender view web page where users can select events on.
*/
class EventCalendarView extends Component {

    /**
    * Constructor.
    */
    constructor(props) {
      super(props);
      
      this.getEvents(new Date(), null);
      
      this.state = {
        selectedEvent: null,
        eventList: []
      };
    }

    /**
    * Calls the backend to retrieve the events between a start and end date.
    * @param date - the date
    * @param view - the view being used.
    */
    getEvents(date, view) {
        const start = moment(date).startOf('month').format('YYYY-MM-DD HH:mm:ss');
        const end = moment(date).endOf('month').format('YYYY-MM-DD HH:mm:ss');
        if (this.monthAndYearValid(date.getMonth(), date.getFullYear())) {
            TTTPost('/get-games-with-details', {
                start: start,
                end: end
            }).then(res => {
                if (res.data.eventDetails) {
                    this.setState({
                        eventList: res.data.eventDetails,
                        selectedEvent: null
                    });
                }
            });
            this.props.history.push(this.getDateRedirect(date.getMonth(), 
                date.getFullYear()));
        }
    }

    /**
    * Returns a redirect link that redirects to the pick tickets web page.
    */
    getRedirect() {
        return ('/pick-tickets?event=' + this.state.selectedEvent.id);
    }

    /**
    * Returns a redirect link to the even calender page with the passed month and year.
    * @param currMonth - the current month selected.
    * @param currYear - the current year selected.
    */
    getDateRedirect(currMonth, currYear) {
        return ('/event-calendar?m=' + currMonth + '&y=' + currYear);
    }

    /**
    * Sets the state with the event that was selected by the user.
    * @param event - the selected event.
    */
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

    /**
    * Handle when the user makes their event choice and have the page redirect to pick tickets.
    */
    onSubmit() {
        if (this.state.selectedEvent) {
            this.setState({
                redirect: true
            });
        }
    }

    /**
    * Ensure that the month and year on the calender are valid.
    * @param qMonth - the month number.
    * @param qYear - the year number.
    */
    monthAndYearValid(qMonth, qYear) {
        const currMonth = new Date().getMonth();
        const currYear = new Date().getFullYear();
        // Makes them integers. Null if didn't work.
        qYear = ~~qYear;
        qMonth = ~~qMonth;
        // If month and year were passed
        if (qMonth !== null && qYear !== null) {
            // If month is between 0 and 11
            if (qMonth >= 0 && qMonth <= 11) {
                // Valid IF query year is current year and query month <= current month 
                // OR IF query year is next year
                if ((qYear === currYear && qMonth >= currMonth) || (qYear === currYear + 1)) {
                    return true;
                }
            }
        }
    }

    /**
    * Main rendering loop.
    */
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
            <div>
                <div className="eventCalendarView">
                    <Well style={{position: 'fixed !important'}}
                      className="eventCalendarViewEventsWell"> Choose Your Game </Well>
                    <Col xs={12} sm={9} md={9} lg={10} className="eventCalendarViewBottomPane">
                        <EventCalendar 
                            events={this.state.eventList}
                            eventSelected={this.eventSelected.bind(this)}
                            selected={this.state.selectedEvent}
                            onNavigate={this.getEvents.bind(this)}
                            month={queryParams.m}
                            year={queryParams.y}
                            validateDate={this.monthAndYearValid.bind(this)} />
                    </Col>
                    <Col xs={12} sm={3} md={3} lg={2} className="eventCalendarViewRightBottomPane">
                        <Row className="eventCalendarViewDetailsRow">
                            <EventDetails
                                eventList={this.state.eventList}
                                selectedEvent={this.state.selectedEvent}
                                eventSelected={this.eventSelected.bind(this)} />
                        </Row>
                        <Row className="eventCalendarViewButtonRow">
                                <Button bsStyle="primary"
                                    onClick={this.onSubmit.bind(this)}>
                                    View Tickets
                                </Button>
                        </Row>
                    </Col>
                    </div>
            </div>
        );
    }
}
export default withRouter(EventCalendarView);
