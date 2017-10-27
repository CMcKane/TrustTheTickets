import React, { Component } from 'react';
import {Grid, Row, Col, FormGroup, ControlLabel,
        FormControl, Well, ListGroup, ListGroupItem} from 'react-bootstrap';
import '../../seating-chart.css';
import '../pick-tickets/pick-tickets.css';
import _ from 'lodash';
import WellsFargoChart from './wells-fargo-chart';
import { TTTPost } from '../backend/ttt-request';
import TicketListItem from './ticket-list-item';

const tickets = [
{
    section_number: "112",
    row_number: "1",
    seat_number: "7",
    price: "45",
    id: 1
},
{
    section_number: "112",
    row_number: "4",
    seat_number: "10",
    price: "35",
    id: 1
}
]

export default class PickTickets extends Component {

    constructor(props) {
        super(props);

        this.state = {
            section: '',
            eventID: '',
            tickets: this.getTickets() //[]
        }
    }

    getAllTickets(eventID) {
        if (eventID.length != '') {
            TTTPost('/all-tickets', {
                event_id: eventID
            })
            .then(res => {
                if (res.data.tickets) this.setState({
                    eventID: eventID,
                    tickets: res.data.tickets
                });
            });
        }
    }

    onChartClick(section) {
        if(section.length > 0) {
            TTTPost('/tickets', {
                section_number: section
            })
            .then(res => {
                if (res.data.tickets) this.setState({
                    section: section,
                    tickets: res.data.tickets
                });
            });

        }
    }

    getTickets() {
        return tickets;
    }

    renderTicketList() {
        return _.map(this.state.tickets, (ticket, id) =>
            <ListGroupItem className="tickets" id={ticket.event_id} >
                Section: {ticket.section_number} Row: {ticket.row_number} Seat: {ticket.seat_number} Price: {ticket.price}
            </ListGroupItem>
        );
    }

    render(){
        return (
            <Grid>
                <h1 className="border-white">
                    <Well className='pick-tickets-well' style={{background: 'transparent'}}>
                        Choose Your Desired Section From The Seating Chart
                    </Well>
                </h1>
                <Row>
                    <Col lg={8}>
                        <WellsFargoChart
                        onSectionSelected={this.onChartClick.bind(this)}
                        selectedSection={this.state.section}/>
                    </Col>
                    <Col lg={4}>
                        <h3 className="text-center"> Tickets </h3>
                        <ListGroup className="list-of-tickets">
                            {this.renderTicketList()}
                        </ListGroup>
                    </Col>
                </Row>
            </Grid>
        );
    }
}