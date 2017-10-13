import React, { Component }  from 'react';
import { TTTGet } from '../backend/ttt-request';

export default class ViewTickets extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tickets: []
        };
    }

    componentDidMount() {
        TTTGet("/tickets")
            .then(res => {
                console.log(res);
                const tickets = res.data.tickets;
                this.setState({ tickets });
            });
    }

    render() {
        return (
            <div>
                <table>
                    <tr>
                        <td>Ticket ID</td>
                        <td>Location</td>
                        <td>Seat Number</td>
                        <td>Section Number</td>
                    </tr>
                    {this.state.tickets.map(ticket =>
                        <tr key={ticket.ticket_id}>
                            <td>{ticket.location_id}</td>
                            <td>{ticket.seat_number}</td>
                            <td>{ticket.section_number}</td>
                        </tr>
                    )}
                </table>
            </div>
        );
    }
}