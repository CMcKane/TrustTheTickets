import React, { Component }  from 'react';
import { Button, Col, Modal, Form, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import Time from 'react-time';

/**
* This modal displayes when the user attempts to edit an existing listing.
*/
export default class EditListingModal extends Component {

  /**
    * Constructor.
    */
  constructor(props) {
    super(props);

    this.state = {
      price: ''
    }
  }
  /**
    * Gets the header of the modal.
    */
  getHeader() {
    if (this.props.listing) {
      return (this.props.listing.homeTeam + " vs " + this.props.listing.awayTeam);
    }
  }

  /**
    * Gets the date of the listing.
    */
  getDate() {
    if (this.props.listing) {
      return (<Time value={this.props.listing.date} format="MMMM D, YYYY h:mmA"/>);
    }
  }

  /**
    * Gets the details about the listing.
    */
  getListingContent() {
    if (this.props.listing) {
      return (
        <p className="editModalText">
        Tickets: Section: {this.props.listing.section}, 
        Row: {this.props.listing.row}, 
        Seats: {this.props.listing.seats[0]} - {this.props.listing.seats[this.props.listing.seats.length-1]} <br />
        </p>
      );
    }
  }

  /**
    * Gets the listing price.
    */
  getListingPrice() {
    if (this.props.listing) {
      return this.props.listing.price;
    }
  }

  /**
    * Handle the change of target values.
    */
  handleChange(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  getValidationState() {
    return null;
  }

  /**
    * Handle when the user submits their change.
    */
  onSubmit() {
    if (this.state.price && ~~this.state.price) {
      this.setState({
        busy: true
      });
      this.props.submitListing(this.state.price, this.props.listing.groupID)
    }
  }

  /**
    * Get the error message if user makes a mistake.
    */
  getErrorText() {
    if (this.props.modalSubmitError) {
      return (
        <div className="editModalText" style={{color: 'red', float: 'left'}}>
          There was an error updating your ticket price. Please try again. 
        </div>
      );
    }
  }

  /**
    * Hides the modal.
    */
  onHide() {
    this.setState({
      busy: false
    });
    this.props.onHide();
  }

  /**
    * Gets the cursor status.
    */
  getCursorStatus() {
    if (this.state.busy) {
      return {cursor: 'wait'};
    }
    return {cursor: 'pointer'}
  }

  /**
    * Main rendering loop.
    */
  render() {
    return (
      <Modal style={this.getCursorStatus()} onHide={this.onHide.bind(this)} 
        show={this.props.show} bsSize="large" aria-labelledby="contained-modal-title-sm">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-sm">Edit Listing</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>{this.getHeader()}</h4>
          <h5>{this.getDate()}</h5>
          {this.getListingContent()}
          <Form horizontal>
            <FormGroup>
              <Col xs={3} sm={3} md={3} lg={2} style={{paddingRight: '0px'}}>
                <ControlLabel>Current Ticket Price</ControlLabel>
              </Col>
              <Col xs={9} sm={8} md={8} style={{paddingLeft: '0px'}}>
                <Col xs={1} sm={1} style={{paddingTop: '7px'}}>
                  $
                </Col>
                <Col xs={8} sm={7} style={{paddingLeft: '0px', paddingRight: '0px'}}>
                  <FormControl 
                        style={{paddingRight: '0px', fontSize: '12px'}}
                        disabled value={this.getListingPrice()} />
                </Col>
              </Col>
            </FormGroup>
            <FormGroup
                validationState={this.getValidationState()}>
              <Col xs={3} sm={3} md={3} lg={2} style={{paddingRight: '0px'}}>
                <ControlLabel>New Ticket Price</ControlLabel>
              </Col>
              <Col xs={9} sm={8} md={8} style={{paddingLeft: '0px'}}>
                <Col xs={1} sm={1} style={{paddingTop: '7px'}}>
                  $
                </Col>
                <Col xs={8} sm={7} style={{paddingLeft: '0px', paddingRight: '0px'}}>
                <FormControl style={{paddingRight: '0px', fontSize: '12px'}} 
                             placeholder="Enter new ticket price"
                             value={this.state.price}
                             name="price"
                             onChange={this.handleChange.bind(this)}/>
                </Col>
              </Col>
            </FormGroup>
        </Form>
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
