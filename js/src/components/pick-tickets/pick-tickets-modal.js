import React, { Component }  from 'react';
import { Button, Col, Modal, Form, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import Time from 'react-time';
import '../../stylesheet.css';


export default class PickTicketsModal extends Component {

  constructor(props) {
    super(props);

    this.state = {
      group: this.props.group,
      tickets: []
    }
  }

  getHeader() {
      return ("Tickets for sale");
  }

  getDate() {
    if (this.props.listing) {
      return (<Time value={this.props.listing.date} format="MMMM D, YYYY h:mmA"/>);
    }
  }

  getTicketContent() {
    if(this.props.group)
    {
        var list = [];
        for(var i = 0; i < this.props.group.length; i++)
        {
            var currTicket = this.props.group[i];
            console.log(currTicket);
            list.push(
                <p>
                    Section: {currTicket.section_number}
                    <br></br>
                    Row: {currTicket.row_number}
                    <br></br>
                    Seat: {currTicket.seat_number}
                    <br></br>
                    Price: ${currTicket.ticket_price}
                    <br></br>
                    <Button id={i} className="buy-ticket-button" bsSize="xsmall" >Buy</Button>
                </p>
            );

        }
        console.log(list);
        return(<div border="1px"> {list} </div>);
    }
  }

  getListingPrice() {
    if (this.props.listing) {
      return this.props.listing.price;
    }
  }

  handleChange(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  getValidationState() {
    return null;
  }

  onSubmit() {
    if (this.state.price && ~~this.state.price) {
      this.setState({
        busy: true
      });
      this.props.submitListing(this.state.price, this.props.listing.groupID)
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
          <Button onClick={this.onSubmit.bind(this)}>Submit</Button>
          <Button onClick={() => this.props.onHide()}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
