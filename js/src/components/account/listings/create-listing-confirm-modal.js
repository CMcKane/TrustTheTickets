import React, {Component} from 'react';
import {Button, ControlLabel, Panel, Modal, Form, FormGroup, FormControl} from 'react-bootstrap';
import '../../../stylesheet.css';


export default class CreateListingConfirmModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            numberOfTickets: this.props.numberOfTickets,
            opponentName: this.props.opponentName,
            gameDate: this.props.gameDate,
            section: this.props.section,
            row: this.props.section,
            seatsInfo: this.props.seatsInfo,
            minPurchaseSize: this.props.minPurchaseSize,
        }
    }

    handleChange(e) {
        this.setState({ticketsEntered: e.target.value});
    }

    onHide() {
        this.setState({
            busy: false
        });
        this.props.onHide();
    }

    onSubmit() {
        //TODO makes this submit all the data to the database
    }

    getErrorText() {
        if (this.props.modalSubmitError) {
            return (
                <div style={{color: 'red', float: 'left'}}>
                    There was an error creating the listing. Please try again.
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

    renderExtrasLabels(aisle, entry, handicap){

        var extras = [];

        if(aisle){
            extras.push(<FormControl.Static>Aisle Seat</FormControl.Static>)
        }
        if(entry){
            extras.push(<FormControl.Static>Early Entry</FormControl.Static>)
        }
        if(handicap){
            extras.push(<FormControl.Static>Handicap Accessible</FormControl.Static>)
        }

        return extras;
    }

    renderSeatsValues(){

        var labels = [];
        if (this.props.seatsInfo.length > 1) {
            for(var i = 1; i <= this.props.numberOfTickets; i++){

                var seat =  this.props.seatsInfo[i-1].seat[0].seatNum;
                var aisleCheck =  this.props.seatsInfo[i-1].seat[0].aisleSeat;
                var earlyEntryCheck =  this.props.seatsInfo[i-1].seat[0].earlyEntry;
                var handicapAccessibleCheck = this.props.seatsInfo[i-1].seat[0].handicapAccessible;

                labels.push(
                    <div>
                        <ControlLabel>{"Seat Number " + i + ":"}</ControlLabel>
                        <FormControl.Static>{seat}</FormControl.Static>
                        <ControlLabel>Ticket Extras</ControlLabel>
                        {this.renderExtrasLabels(aisleCheck, earlyEntryCheck, handicapAccessibleCheck)}
                    </div>
                )
            }

            return labels;
        }
    }

    render() {
        return (
            <Modal style={this.getCursorStatus()} onHide={this.onHide.bind(this)}
                   show={this.props.show} bsSize="large" aria-labelledby="contained-modal-title-sm">
                <Modal.Header closeButton>
                    <Modal.Title>New Listing Creation Review</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Please confirm all fields are correct before creating your listing.</h4>
                    <Form>
                        <FormGroup>
                            <Panel>
                                <div>
                                    <ControlLabel>Game Date: </ControlLabel>
                                    <FormControl.Static>{this.props.gameDate}</FormControl.Static>
                                    <ControlLabel>Opponent Name: </ControlLabel>
                                    <FormControl.Static>{this.props.opponentName}</FormControl.Static>
                                </div>
                            </Panel>
                            <Panel>
                                <div>
                                    <ControlLabel>Section Number: </ControlLabel>
                                    <FormControl.Static>{this.props.gameDate}</FormControl.Static>
                                    <ControlLabel>Row Number: </ControlLabel>
                                    <FormControl.Static>{this.props.opponentName}</FormControl.Static>
                                    {this.renderSeatsValues()}
                                </div>
                            </Panel>
                            <Panel>
                                <div>
                                    <ControlLabel>Sell in Minimum Groups of: </ControlLabel>
                                    <FormControl.Static>{this.props.minPurchaseSize}</FormControl.Static>
                                    <ControlLabel>Price Per Ticket: </ControlLabel>
                                    <FormControl.Static>{this.props.ticketPrice}</FormControl.Static>
                                </div>
                            </Panel>
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    {this.getErrorText()}
                    <Button onClick={this.onSubmit.bind(this)}>Submit Listing</Button>
                    <Button onClick={() => this.props.onHide()}>Close</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}
