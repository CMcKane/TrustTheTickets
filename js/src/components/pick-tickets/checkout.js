import React, { Component }  from 'react';
import _ from 'lodash';
import {Grid, Table, Col, Button, Well} from 'react-bootstrap';
import {TTTPost, TTTGet} from '../backend/ttt-request';
import { Redirect } from 'react-router-dom';
import withAuth from '../auth/with-auth';
import AuthService from '../auth/auth-service';
import ReactCountdownClock from 'react-countdown-clock';
import CheckoutConfirmationModal from './checkout-confirmation-modal';

/**
    This component is the check out view of the website.
**/
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
            redirect: false,
            tempTicketIds: [],
            cursor: 'pointer'
        }
        this.taxPerTicket = [this.props.checkoutTickets.length];
        this.commPerTicket = [this.props.checkoutTickets.length];
        this.subtotalPerTicket = [this.props.checkoutTickets.length];
        this.determinePrices();
      }



    componentDidMount() {

        window.onbeforeunload = () => {
            this.unlockTickets();
        };

        // Need to "lock in" tickets in DB for a few minutes here
        var ticketIds = []
        for (var i = 0; i < this.props.checkoutTickets.length; i++) {
          ticketIds.push(this.props.checkoutTickets[i].ticket_id);
        }
        this.setState({
            tempTicketIds: ticketIds
        })
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

    /**
    * Calls the prop method to return from the checkout page after it is completed.
    */
    onComplete() {
         this.props.returnFromCheckout();
    }

    /**
    * Triggers on page un-load.
    */
    componentWillUnmount() {
        this.unlockTickets();
    }

    /**
    * Calls the backed to unlock the tickets pass in the POST.
    */
    unlockTickets() {
        TTTPost('/unlock-tickets', {
            ticketIds: this.state.tempTicketIds
        });
    }

    /**
    * Determines the prices for te checkout page, including the taxes, commission and subtotals.
    */
    determinePrices() {
        var tickets = this.props.checkoutTickets;
        var subtotal = 0;
        // Accumulate the subtotal.
        for(var i = 0; i < tickets.length; i++)
        {
            this.subtotalPerTicket[i] = tickets[i].ticket_price;
            subtotal = subtotal + tickets[i].ticket_price;
        }

        var fees = 0;
        var taxTotal = 0;
        var commTotal = 0;
        var taxPer = [];
        var commPer = [];
        var subtotalPer =  [];

        // Accumulate the tax and commission.
        for(var i = 0; i < tickets.length; i++)
        {
            this.taxPerTicket[i] = tickets[i].ticket_price * this.props.taxPercent;
            this.commPerTicket[i] = tickets[i].ticket_price * this.props.commissionPercent;

            taxTotal  += (tickets[i].ticket_price * this.props.taxPercent);
            commTotal += (tickets[i].ticket_price * this.props.commissionPercent);
        }
        // Fees are the added tax and commission.
        fees = taxTotal + commTotal;

        this.fees = Math.round(fees * 100) / 100;
        this.taxTotal = Math.round(taxTotal * 100) / 100;
        this.commTotal = Math.round(commTotal * 100) / 100;
        this.subtotal = Math.round(subtotal * 100) / 100;
        this.total = this.commTotal + this.taxTotal + this.subtotal;

        this.setState({
            subtotal: subtotal,
            tax: taxTotal,
            fees: fees,
            total: subtotal + fees
        });

    }

    /**
    * Calls the backend to insert a new transaction.
    * This occurs when the users goes through with buying the tickets.
    * Calls the backend to send the ticket PDF file.
    */
    purchaseTickets() {
        var insertSuccessful = false;
        var emailSuccess = false;
        var token = this.Auth.getToken();
        this.setState({cursor: 'wait'});
        TTTPost('/insert-transaction', {
            eventID: this.props.eventID,
            token: token,
            tickets: this.props.checkoutTickets,
            commission: this.commTotal,
            tax: this.taxTotal,
            taxPerTicket: this.taxPerTicket,
            commPerTicket: this.commPerTicket,
            subtotalPerTicket: this.subtotalPerTicket,
            subtotal: this.subtotal,
            total: this.total,
            group_id: this.props.checkoutTickets[0].group_id
        }).then(res => {
            this.setState({
                redirect: res.data.success,
                cursor: 'pointer'
            });
        });

        TTTPost('/send-tickets-pdf', {
            token: token,
            ticketIds: this.state.tempTicketIds
        });
    }

    /**
    * Build the comments string for the checkout page.
    * @param ticket the ticket to get the attributes from.
    */
	getComments(ticket) {
        var comments = '-';
        if (ticket.early_access === 1) {
            comments += " Early Access  - ";
        }
        if (ticket.aisle_seat === 1) {
            comments += "Aisle Seat - ";
        }
        if (ticket.handicap === 1) {
            comments += "Handicap - ";
        }
        return comments;
	}

    /**
    * Creates the rendering of each ticket information section of the web page.
    */
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
                        <td>${ticket.ticket_price.toFixed(2)}</td>
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

    /**
    * Renders the ticket fees and totals for the web page.
    */
    renderTicketTotals() {
        return (
            <p className="leftTable">
                <table className="checkoutCosts">
                    <tr>
                        <th className="verticalTableHeading">Subtotal:</th>
                        <td className="verticalTableData">${this.subtotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <th className="verticalTableHeading">Tax:</th>
                        <td className="verticalTableData">${this.taxTotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <th className="verticalTableHeading">Fees:</th>
                        <td className="verticalTableData">${this.commTotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <th className="verticalTableHeading">Total:</th>
                        <td className="verticalTableData">${this.total.toFixed(2)}</td>
                    </tr>
                </table>
            </p>
        );
    }

    /**
    * The render method performs all rendering of the web page.
    */
    render() {
        return (
            <div style={{overflowY: 'auto', cursor: this.state.cursor}}
             className="globalBody globalImage">
            <CheckoutConfirmationModal 
                show={this.state.redirect}
                onHide={this.onComplete.bind(this)} />
                <div className="globalBody globalImageOverlay">
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

                        <div style={{height: '90%'}}>
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
            </div>
        );
	}
}

export default withAuth(Checkout);
