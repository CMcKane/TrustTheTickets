import React, { Component }  from 'react';
import { Button, Modal } from 'react-bootstrap';
import Time from 'react-time';
import '../../../stylesheet.css';


export default class MyListingModal extends Component {

  constructor(props) {
    super(props);
  }

  getHeader() {
    if (this.props.listing) {
      return (this.props.listing.homeTeam + " vs " + this.props.listing.awayTeam);
    }
  }

  getDate() {
    if (this.props.listing) {
      return this.props.listing.date;
    }
  }

  render() {
    return (
      <Modal show={this.props.show} bsSize="large" aria-labelledby="contained-modal-title-sm">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-sm">Edit Listing</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>{this.getHeader()}</h4>
          <h5><Time value={this.getDate()} format="MMMM D, YYYY h:mmA"/></h5>
          <p>Text and stuff</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => this.props.submitListing()}>Submit</Button>
          <Button onClick={() => this.props.onHide()}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
