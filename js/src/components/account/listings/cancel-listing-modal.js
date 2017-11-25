import React, { Component }  from 'react';
import { Button, Modal } from 'react-bootstrap';
import Time from 'react-time';
import '../../../stylesheet.css';


export default class CancelListingModal extends Component {

  constructor(props) {
    super(props);

    this.state = {
      price: ''
    }
  }

  getHeader() {
    if (this.props.listing) {
      return (this.props.listing.homeTeam + " vs " + this.props.listing.awayTeam);
    }
  }

  getDate() {
    if (this.props.listing) {
      return (<Time value={this.props.listing.date} format="MMMM D, YYYY h:mmA"/>);
    }
  }

  getListingContent() {
    if (this.props.listing) {
      return (
        <p className="editModalText">
        Tickets: Section: {this.props.listing.section}, 
        Row: {this.props.listing.row}, 
        Seats: {this.props.listing.seats[0]} - {this.props.listing.seats[this.props.listing.seats.length-1]} <br />
        Price Per Ticket: ${this.props.listing.price}
        </p>
      );
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
      this.setState({
        busy: true
      });
      this.props.cancelListing(this.props.listing.groupID)
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
          <Modal.Title id="contained-modal-title-sm">
            <h2>Are you sure you want to cancel this listing?</h2>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>{this.getHeader()}</h4>
          <h5>{this.getDate()}</h5>
          {this.getListingContent()}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.onSubmit.bind(this)}>Yes</Button>
          <Button onClick={() => this.props.onHide()}>No</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
