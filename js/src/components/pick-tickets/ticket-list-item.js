import React, { Component }  from 'react';
import _ from 'lodash';
import {Grid, Row, Col, Button} from 'react-bootstrap';
import '../../stylesheet.css';


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
},
{
    section_number: "112",
    row_number: "4",
    seat_number: "10",
    price: "35",
    id: 1
},
{
    section_number: "112",
    row_number: "4",
    seat_number: "10",
    price: "35",
    id: 1
},
{
    section_number: "112",
    row_number: "4",
    seat_number: "10",
    price: "35",
    id: 1
},
{
    section_number: "112",
    row_number: "4",
    seat_number: "10",
    price: "35",
    id: 1
},
{
    section_number: "112",
    row_number: "4",
    seat_number: "10",
    price: "35",
    id: 1
},
{
    section_number: "112",
    row_number: "4",
    seat_number: "10",
    price: "35",
    id: 1
},
{
    section_number: "112",
    row_number: "4",
    seat_number: "10",
    price: "35",
    id: 1
},
{
    section_number: "112",
    row_number: "4",
    seat_number: "10",
    price: "35",
    id: 1
},
{
    section_number: "112",
    row_number: "4",
    seat_number: "10",
    price: "35",
    id: 1
},
{
    section_number: "112",
    row_number: "4",
    seat_number: "10",
    price: "35",
    id: 1
},
{
    section_number: "112",
    row_number: "4",
    seat_number: "10",
    price: "35",
    id: 1
},
{
    section_number: "112",
    row_number: "4",
    seat_number: "10",
    price: "35",
    id: 1
},
{
    section_number: "112",
    row_number: "4",
    seat_number: "10",
    price: "35",
    id: 1
},
{
    section_number: "112",
    row_number: "4",
    seat_number: "10",
    price: "35",
    id: 1
},
{
    section_number: "112",
    row_number: "4",
    seat_number: "10",
    price: "35",
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


export default class TicketListItem extends Component {

    constructor(props) {
        super(props);

        this.state = {
            tickets: this.props.ticketsFromPickTicket

        }
    }

    //render the values in the tickets
    renderTicketList() {
        return _.map(this.state.tickets, (ticket, id) =>
                <li class="list-group-item" border-color="red" onclick="">
                    Section: {ticket.section_number} Row: {ticket.row_number}
                    <br></br>
                    Seat: {ticket.seat_number} Price: {ticket.price}
                    <br></br>
                    <Button className="buy-button" bsSize="xsmall">Buy</Button>
                </li>
        );
    }

    //display faux tickets
    getTickets() {
        return ;
    }

	render() {
		return (
            <div className="ticketListItemTicketBorder">
                {this.renderTicketList()}
            </div>
		);
	}
}
//
//Section #: {this.state.tickets.section_number},
//					Row #: {this.state.tickets.row_number},
//					Price: {this.state.tickets.price}



