import React, { Component }  from 'react';
import _ from 'lodash';
import {Grid, Table, Col, Button, Well} from 'react-bootstrap';
import {TTTPost, TTTGet} from '../backend/ttt-request';
import { Redirect } from 'react-router-dom';
import withAuth from '../auth/with-auth';
import AuthService from '../auth/auth-service';
import '../../stylesheet.css';

var tax = 0;
var comm = 0;
var fees;
var subtotal;
var total;
var taxTotal;
var commTotal;

class Checkout extends Component {

  constructor(props) {
    super(props);
    this.Auth = new AuthService();
    this.state = {
        commissionPercent: this.props.commissionPercent,
        taxPercent: this.props.taxPercent,
        subtotal: 0,
        tax: 0,
        fees: 0,
        total: 0
    }

    this.determinePrices();
  }

  componentDidMount() {
    // Need to "lock in" tickets in DB for a few minutes here
    var ticketIds = []
    for (var i = 0; i < this.props.checkoutTickets.length; i++) {
      ticketIds.push(this.props.checkoutTickets[i].ticket_id);
    }
      TTTPost('/hold-tickets', {
          ticketIds: ticketIds,
          token: this.Auth.getToken()
      }).then(res => {
          if (res.data.authenticated) {
              // You're good
          }
          else {
              // Can't buy
          }
      });
    /*this.tax = this.props.commissionPercent;
    this.comm = this.props.taxPercent;

    console.log(this.props.commissionPercent);
    console.log(comm);*/
    this.setState({
        commissionPercent: this.props.commissionPercent,
        taxPercent: this.props.taxPercent
    });
  }

    determinePrices() {
        var tickets = this.props.checkoutTickets;
        var subtotal = 0;
        for(var i = 0; i < tickets.length; i++)
        {
            subtotal = subtotal + tickets[i].ticket_price;
        }

        var fees = 0;
        var taxTotal = 0;
        var commTotal = 0;

        /*console.log("tax");
        console.log(this.props.taxPercent);
        console.log("commission");
        console.log(this.props.commissionPercent);
*/
        for(var i = 0; i < tickets.length; i++)
        {
            taxTotal  += (tickets[i].ticket_price * this.props.taxPercent);
            commTotal += (tickets[i].ticket_price * this.props.commissionPercent);
        }
        fees = taxTotal + commTotal;

        this.fees = fees;
        this.taxTotal = taxTotal;
        this.commTotal = commTotal;
        this.subtotal = subtotal;

        this.setState({
            subtotal: subtotal,
            tax: taxTotal,
            fees: fees,
            total: subtotal + fees
        });

    }

    purchaseTickets() {
        // TODO
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
              <table className="ticketInfoTable">
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
	/*
		var tickets = this.props.checkoutTickets;
    var subtotal = 0;
    //var fees = 0.10;
    for(var i = 0; i < tickets.length; i++)
    {
        subtotal = subtotal + tickets[i].ticket_price;
    }*/
    //var fees = 0.10*subtotal;
    return (
        <p className="tableNewLine">
        <table className="checkoutCosts">
              <tr>
                  <th className="verticalTableHeading">Subtotal:</th>
                  <td>${this.subtotal}</td>
              </tr>
              <tr>
                  <th className="verticalTableHeading">Fees:</th>
                  <td>${this.fees}</td>
              </tr>
              <tr>
                  <th className="verticalTableHeading">Total:</th>
                  <td>${this.fees + this.subtotal}</td>
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
              Checkout
          </Button>
        </div>
        </div>
      </Grid>
      </div>
		);
	}
}

export default withAuth(Checkout);
