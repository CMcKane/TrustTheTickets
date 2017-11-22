import React, {Component} from 'react';
import Time from 'react-time';
import {Button, ControlLabel, Panel, Modal, Form, FormGroup, FormControl, Grid, Col, Row} from 'react-bootstrap';
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
            extras.push(<Col lg={4}><FormControl.Static>Aisle Seat</FormControl.Static></Col>)
        }
        if(entry){
            extras.push(<Col lg={4}><FormControl.Static>Early Entry</FormControl.Static></Col>)
        }
        if(handicap){
            extras.push(<Col lg={4}><FormControl.Static>Handicap Accessible</FormControl.Static></Col>)
        }

        return extras;
    }

    renderSeatsValues(){

        var labels = [];
        if (this.props.seatsInfo.length > 0) {
            for(var i = 1; i <= this.props.numberOfTickets; i++){

                var seat =  this.props.seatsInfo[i-1].seat[0].seatNum;
                var aisleCheck =  this.props.seatsInfo[i-1].seat[0].aisleSeat;
                var earlyEntryCheck =  this.props.seatsInfo[i-1].seat[0].earlyEntry;
                var handicapAccessibleCheck = this.props.seatsInfo[i-1].seat[0].handicapAccessible;

                labels.push(
                    <div>
                        <Row>
                            <Col lg={4}>
                                <ControlLabel>{"Seat Number " + i + ":"}</ControlLabel>
                                <FormControl.Static>{seat}</FormControl.Static>
                            </Col>
                            <Col lg={4}>
                                <Row>
                                    <ControlLabel>Ticket Extras</ControlLabel>
                                </Row>
                                <Row>
                                    {this.renderExtrasLabels(aisleCheck, earlyEntryCheck, handicapAccessibleCheck)}
                                </Row>
                            </Col>
                        </Row>
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
                        <div className="globalCenterThis">
                        <FormGroup>
                            <Panel className="globalCenterThis">
                                <div>
                                    <Grid>
                                        <Row>
                                            <Col lg={4}>
                                                <ControlLabel>Game Date: </ControlLabel>
                                                <FormControl.Static>{<Time value={this.props.gameDate} format="MMMM D, YYYY h:mmA"/>}</FormControl.Static>
                                            </Col>
                                            <Col lg={4}>
                                                <ControlLabel>Opponent Name: </ControlLabel>
                                                 <FormControl.Static>{this.props.opponentName}</FormControl.Static>
                                            </Col>
                                        </Row>
                                    </Grid>
                                </div>
                            </Panel>
                            <Panel className="globalCenterThis">
                                <div>
                                    <Grid>
                                        <Row>
                                            <Col lg={4}>
                                                <ControlLabel>Section Number: </ControlLabel>
                                                <FormControl.Static>{this.props.section}</FormControl.Static>
                                            </Col>
                                            <Col lg={4}>
                                                <ControlLabel>Row Number: </ControlLabel>
                                                <FormControl.Static>{this.props.row}</FormControl.Static>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col lg={4}>
                                            {this.renderSeatsValues()}
                                            </Col>
                                        </Row>
                                    </Grid>
                                </div>
                            </Panel>
                            <Panel className="globalCenterThis">
                                <div>
                                    <Grid>
                                        <Row>
                                            <Col lg={4}>
                                                <ControlLabel>Sell in Minimum Groups of: </ControlLabel>
                                                <FormControl.Static>{this.props.minPurchaseSize}</FormControl.Static>
                                            </Col>
                                            <Col lg={4}>
                                                <ControlLabel>Price Per Ticket: </ControlLabel>
                                                <FormControl.Static>{this.props.ticketPrice}</FormControl.Static>
                                            </Col>
                                        </Row>
                                    </Grid>
                                </div>
                            </Panel>
                        </FormGroup>
                        </div>
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
