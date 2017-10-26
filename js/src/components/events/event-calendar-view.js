import React, { Component }  from 'react';
import EventCalendar from '../calendar/calendar';
import { Well, Row, Col, Button } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import './event-calendar-view.css';
import EventDetails from './event-details';
import { TTTPost } from '../backend/ttt-request';

const games = [
{
    end: 'Tue Oct 17 2017 18:00:00 GMT-0400 (EDT)',
    start: 'Tue Oct 17 2017 18:00:00 GMT-0400 (EDT)',
    gameTime: 'Tue Oct 17 2017 18:00:00 GMT-0400 (EDT)',
    title: 'Sixers vs Grizzlies',
    homeTeam: 'Philadelphia 76ers',
    awayTeam: 'Memphis Grizzlies',
    id: 13
},
{
    end: 'Fri Oct 20 2017 18:00:00 GMT-0400 (EDT)',
    start: 'Fri Oct 20 2017 18:00:00 GMT-0400 (EDT)',
    gameTime: 'Fri Oct 20 2017 18:00:00 GMT-0400 (EDT)',
    title: 'Sixers vs Celtics',
    homeTeam: 'Philadelphia 76ers',
    awayTeam: 'Boston Celtics',
    id: 20
}
]

export default class EventCalendarView extends Component {

    constructor(props) {
      super(props);

      this.state = {
        selected: false,
        games: [],
        eventID: null,
        home: null,
        away: null,
        gameTime: null,
        numTickets: null,
        minPrice: null,
        populated: false
      };
    }

    getEvents() {
        return games;
    }

    getRedirect() {
        return '/pick-tickets?event=' + this.state.eventID;
    }

    eventSelected(event) {
        TTTPost('/ticket-details', {
          eventID: event.id
        }).then(res => {
          if (res.data.success) { 
            this.setState({
                eventID: event.id,
                home: event.homeTeam,
                away: event.awayTeam,
                gameTime: event.gameTime,
                numTickets: res.data.numTickets,
                minPrice: res.data.minPrice,
                populated: true
            });
          }
        });
    }

    onSubmit() {
        if (this.state.eventID) {
            this.setState({
                'selected': true
            });
        }
    }

    render() {
        if (this.state.selected) {
            return <Redirect to={this.getRedirect()} />
        }
        else return (
            <div className="eventCalendarView">
                <Well className="events-well"> Choose Your Game </Well>
                    <Col lg={8} className="eventCalendarView">
                        <EventCalendar events={this.getEvents()} eventSelected={this.eventSelected.bind(this)}/>
                    </Col>
                    <Col lg={4}>
                        <Row>
                            <EventDetails 
                                home={this.state.home}
                                away={this.state.away}
                                gameTime={this.state.gameTime}
                                numTickets={this.state.numTickets}
                                minPrice={this.state.minPrice}
                                populated={this.state.populated}
                                 />
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