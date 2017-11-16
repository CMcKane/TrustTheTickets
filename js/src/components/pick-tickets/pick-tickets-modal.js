import React, { Component }  from 'react';
import { Button, Col, Modal, Form, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import Time from 'react-time';
import '../../stylesheet.css';


export default class PickTicketsModal extends Component {

  constructor(props) {
    super(props);

    this.state = {
      group: this.props.group
    }
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
                    <p> Section: {currTicket.section_number} </p>
                    <p>Row: {currTicket.row_number} </p>
                    <p> Seat: {currTicket.seat_number} </p>
                    <p> Price: ${currTicket.ticket_price} </p>
                    <Button id={i} className="buy-ticket-button" bsSize="xsmall" >Buy</Button>
                </p>
            );

        }
        return(<div> {list} </div>);
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
    return (
      <Modal style={this.getCursorStatus()} onHide={this.onHide.bind(this)} 
        show={this.props.show} bsSize="large" aria-labelledby="contained-modal-title-sm">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-sm">Tickets</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>{this.getHeader()}</h4>
          {this.getTicketContent()}
        </Modal.Body>
        <Modal.Footer>
          {this.getErrorText()}
          <Button onClick={() => this.props.onHide()}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
