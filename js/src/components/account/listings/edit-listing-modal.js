import React, { Component }  from 'react';
import { Button, Col, Modal, Form, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import Time from 'react-time';
import '../../../stylesheet.css';


export default class MyListingModal extends Component {

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
        <p>
        Tickets: Section: {this.props.listing.section}, 
        Row: {this.props.listing.row}, 
        Seats: {this.props.listing.seats[0]} - {this.props.listing.seats[this.props.listing.seats.length-1]} <br />
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
