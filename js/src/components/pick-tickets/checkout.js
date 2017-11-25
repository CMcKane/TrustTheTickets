import React, { Component }  from 'react';
import _ from 'lodash';
import {Grid, Table, Col, Button, Well} from 'react-bootstrap';
import {TTTPost, TTTGet} from '../backend/ttt-request';
import { Redirect } from 'react-router-dom';
import withAuth from '../auth/with-auth';
import AuthService from '../auth/auth-service';
import '../../stylesheet.css';
import ReactCountdownClock from 'react-countdown-clock';

var tax = 0;
var comm = 0;
var fees;
var subtotal;
var total;
var taxTotal;
var commTotal;
var ticketIds = [];

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
        total: 0,
        redirect: false
    }

    this.determinePrices();
  }

  componentDidMount() {
    // Need to "lock in" tickets in DB for a few minutes here
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
        this.setState({
            commissionPercent: this.props.commissionPercent,
            taxPercent: this.props.taxPercent
        });
  }

    onComplete() {
         this.props.returnFromCheckout();
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

        for(var i = 0; i < tickets.length; i++)
        {
            taxTotal  += (tickets[i].ticket_price * this.props.taxPercent);
            commTotal += (tickets[i].ticket_price * this.props.commissionPercent);
        }
        fees = taxTotal + commTotal;

        this.fees = Math.round(fees * 100) / 100;
        this.taxTotal = Math.round(taxTotal * 100) / 100;
        this.commTotal = Math.round(commTotal * 100) / 100;
        this.subtotal = Math.round(subtotal * 100) / 100;
        this.total = this.commTotal + this.taxTotal + this.subtotal

        this.setState({
            subtotal: subtotal,
            tax: taxTotal,
            fees: fees,
            total: subtotal + fees
        });

    }

    purchaseTickets() {
        var insertSuccessful = false;
        var emailSuccess = false;
        var token = this.Auth.getToken();
        TTTPost('/insert-transaction', {
            token: token,
            tickets: this.props.checkoutTickets,
            commission: this.commTotal,
            tax: this.taxTotal,
            subtotal: this.subtotal,
            total: this.total,
            group_id: this.props.checkoutTickets[0].group_id
        }).then(res => {
            insertSuccessful = res.data.successful
        });

        console.log(ticketIds);
        var tempTicketIds = [1,2,3,4];

        TTTPost('/send-tickets-pdf', {
            token: token,
            ticketIds: tempTicketIds
        }).then(res => {
            emailSuccess = res.data.success
        });

        this.setState({redirect: true});

    }

	getComments(ticket) {
        var comments = '- '
        if (ticket.early_access === 1)
          comments += "Early Access  - "
        if (ticket.aisle_seat === 1)
          comments += "Aisle Seat - "
        if (ticket.handicap === 1)
          comments += "Handicap - "
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

    return (
        <p className="leftTable">
        <table className="checkoutCosts">
              <tr>
                  <th className="verticalTableHeading">Subtotal:</th>
                  <td className="verticalTableData">${this.subtotal}</td>
              </tr>
              <tr>
                  <th className="verticalTableHeading">Tax:</th>
                  <td className="verticalTableData">${this.taxTotal}</td>
              </tr>
              <tr>
                  <th className="verticalTableHeading">Fees:</th>
                  <td className="verticalTableData">${this.commTotal}</td>
              </tr>
              <tr>
                  <th className="verticalTableHeading">Total:</th>
                  <td className="verticalTableData">${this.total}</td>
              </tr>
        </table>
        </p>
    );
	}


	render() {
	    if(this.state.redirect)
        {
            return <Redirect to={"/checkout-landing?event=" + this.props.eventID} />
        }
        else
        {
            return (
              <div className="globalBody globalImage">
                <p className="timer">
                    <ReactCountdownClock
                        seconds={300}
                        color="#000"
                        alpha={0.9}
                        size={50}
                        onComplete={this.onComplete.bind(this)}
                    />
                </p>
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
}

export default withAuth(Checkout);
