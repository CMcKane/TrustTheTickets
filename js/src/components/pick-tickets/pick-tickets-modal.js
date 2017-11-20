import React, { Component }  from 'react';
import { Button, Col, Modal, Form, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import Time from 'react-time';
import { Redirect } from 'react-router-dom';
import '../../stylesheet.css';


export default class PickTicketsModal extends Component {

  constructor(props) {
    super(props);

    this.state = {
      group: this.props.group,
      redirect: false,
      redirectLink: ''
    }
  }

  createCheckoutRedirectLink(e) {
      var ticket = this.props.group[e.target.id];
      this.setState({
        redirect: true,
        redirectLink: '/checkout-view?section=' + ticket.section_number +
                                     '&row=' + ticket.row_number +
                                     '&seat=' + ticket.seat_number +
                                     '&price=' + ticket.ticket_price
      });
  }

  getHeader() {
      return ("Tickets for sale");
  }

  getTicketContent() {
    if(this.props.group)
    {
        var list = [];
        for(var i = 0; i < this.props.group.length; i++)
        {
            var currTicket = this.props.group[i];
            list.push(
                <p className="ticketBorder">
                    <p className="ticketAttributes">Section: {currTicket.section_number} </p>
                    <p className="ticketAttributes">Row: {currTicket.row_number} </p>
                    <p className="ticketAttributes">Seat: {currTicket.seat_number} </p>
                    <p className="ticketAttributes">Price: ${currTicket.ticket_price}
                    <Button
                        id={i}
                        style={{marginLeft: "60px", color: "black"}}
                        onClick={this.createCheckoutRedirectLink.bind(this)}>
                        Buy
                    </Button>
                    </p>
                </p>
            );
        }
        return(<div > {list} </div>);
    }
  }

  getErrorText() {
    if (this.props.modalSubmitError) {
      return (
        <div style={{color: 'red', float: 'left'}}>
          There was an error updating your ticket price. Please try again. 
        </div>
      );
    }
  }

  onHide() {
    this.setState({
      busy: false
    });
    this.props.onHide();
  }

  getCursorStatus() {
    if (this.state.busy) {
      return {cursor: 'wait'};
    }
    return {cursor: 'pointer'}
  }

  render() {
        if(this.state.redirect)
        {
            return <Redirect to={this.state.redirectLink} />
        }
        else
        {
            return (
              <Modal style={this.getCursorStatus()} onHide={this.onHide.bind(this)}
                show={this.props.show} bsSize="large" aria-labelledby="contained-modal-title-sm">
                <Modal.Header className="pickTicketModalHeader" closeButton>
                  <Modal.Title id="contained-modal-title-sm">Tickets</Modal.Title>
                </Modal.Header>
                <Modal.Body className="pickTicketModalBody">
                  <h4>{this.getHeader()}</h4>
                  {this.getTicketContent()}
                </Modal.Body>
                <Modal.Footer className="pickTicketModalHeader">
                  {this.getErrorText()}
                  <Button onClick={() => this.props.onHide()}>Close</Button>
                </Modal.Footer>
              </Modal>
            );
        }
    }
}
