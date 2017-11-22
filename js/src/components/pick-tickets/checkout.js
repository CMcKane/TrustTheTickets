import React, { Component }  from 'react';
import _ from 'lodash';
import {Grid, Table, Col, Button, Well} from 'react-bootstrap';
import '../../stylesheet.css';

export default class Checkout extends Component {

  componentDidMount() {
    // Need to "lock in" tickets in DB for a few minutes here
  }

  purchaseTickets() {
    // Need to update database info to reflect that tickets are no longer available
    // Also handle case if tickets can't be purchased
  }

	getComments(ticket) {
    var comments = ''
    if (ticket.early_access === 1)
      comments += "Early Access "
    if (ticket.aisle_seat === 1)
      comments += "Aisle Seat "
    if (ticket.handicap === 1)
      comments += "Handicap"
    return comments;
	}

	renderTicketInfo() {
		return _.map(this.props.checkoutTickets, (ticket, index) =>
			    <p className="tableNewLine">
              <table className="table">
                  <thead>
                      <th className="tableHeading">Section</th>
                      <th className="tableHeading">Row</th>
                      <th className="tableHeading">Seat</th>
                      <th className="tableHeading">Price</th>
                  </thead>
                  <tbody>
                      <tr>
                          <td>{ticket.section_number}</td>
                          <td>{ticket.row_number}</td>
                          <td>{ticket.seat_number}</td>
                          <td>${ticket.ticket_price}</td>
                      </tr>
                  </tbody>
                  <tbody className="checkoutAdditional">
                      <tr>
                          <th className="tableHeading2">Comments</th>
                      </tr>
                      <tr className="checkoutAdditional">
                          <td>{this.getComments(ticket)}</td>
                      </tr>
                  </tbody>
              </table>
          </p>
        );
	}

	renderTicketTotals() {
		var tickets = this.props.checkoutTickets;
    var subtotal = 0;
    var fees = 0.10;
    for(var i = 0; i < tickets.length; i++)
    {
        subtotal = subtotal + tickets[i].ticket_price;
    }
    var fees = 0.10*subtotal;
    return (
        <p className="tableNewLine">
        <table className="checkoutCosts">
              <tr>
                  <th className="verticalTableHeading">Subtotal:</th>
                  <td>${subtotal}</td>
              </tr>
              <tr>
                  <th className="verticalTableHeading">Fees:</th>
                  <td>${fees}</td>
              </tr>
              <tr>
                  <th className="verticalTableHeading">Total:</th>
                  <td>${fees + subtotal}</td>
              </tr>
        </table>
        </p>
    );
	}

	render() {
		return (
      <div className="globalBody globalImage">
      <Grid style={{paddingTop: "25px", height: '80%'}}>
          <h1>
              <Well className='checkoutHeader'>
                  Checkout
              </Well>
          </h1>
        <div style={{overflowY: 'auto', height: '90%'}}>
        {this.renderTicketInfo()}
        {this.renderTicketTotals()}
        <div className="checkoutButton">
          <Button
              id={1}
              style={{marginLeft: "165px", color: "black"}}
              bsSize="large"
              onClick={this.purchaseTickets.bind(this)}>
              Buy
          </Button>
        </div>
        </div>
      </Grid>
      </div>
		);
	}
}