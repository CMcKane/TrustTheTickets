import React, {Component} from 'react';
import {Button, Col, Modal, Form, FormGroup, ControlLabel, FormControl} from 'react-bootstrap';
import '../../../stylesheet.css';


export default class CreateListingModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            numberOfTickets: this.props.numberOfTickets,
            ticketsEntered: null,
        }
    }

    handleChange(e) {
        this.setState({ticketsEntered: e.target.value});
    }

    getValidationState() {
        const minimumInt = 6;
        if (this.state.ticketsEntered >= minimumInt) return 'success';
        else if (this.state.ticketsEntered < 6) return 'error';
        return null;
    }

    onHide() {
        this.setState({
            busy: false
        });
        this.props.onHide();
    }

    onSubmit() {
        if (this.state.ticketsEntered && ~~this.state.ticketsEntered) {
            this.setState({
                busy: true
            });
            this.props.changeNumberOfTickets(this.state.ticketsEntered);
        }
    }

    getErrorText() {
        if (this.props.modalSubmitError) {
            return (
                <div style={{color: 'red', float: 'left'}}>
                    There was an error setting number of tickets. Please try again.
                </div>
            );
        }
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
                    <Modal.Title>Ticket Entry</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Enter the number of tickets you are selling.</h4>
                    <Form>
                        <FormGroup controlId="formBasicText"
                                   validationState={this.getValidationState()}>
                            <FormControl
                                type="text"
                                value={this.state.ticketsEntered}
                                placeholder="Enter Number of Tickets"
                                onChange={this.handleChange.bind(this)}/>
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    {this.getErrorText()}
                    <Button onClick={this.onSubmit.bind(this)}>Submit</Button>
                    <Button onClick={() => this.props.onHide()}>Close</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}
