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
            dbGameDate: this.props.dbGameDate,
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

    renderExtrasLabels(aisle, entry, handicap) {

        var extras = [];


        if (aisle) {
            extras.push(<Col lg={3}><p style={{fontSize: "20px"}}>Aisle Seat</p></Col>)
        }
        if (entry) {
            extras.push(<Col lg={3}><p style={{fontSize: "20px"}}>Early Entry</p></Col>)
        }
        if (handicap) {
            extras.push(<Col lg={3}><p style={{fontSize: "20px"}}>Handicap Accessible</p></Col>)
        }
        if (!aisle && !entry && !handicap) {
            extras.push(<Col lg={10}><p style={{fontSize: "20px"}}>No Extras For This Ticket</p></Col>)
        }

        return extras;
    }

    displayGroupSizeLabel() {

        let arr = [];
        if (this.props.minPurchaseSize !== 1) {
            arr.push(<div><p style={{display: "inline", fontSize: "20px", fontWeight: "bold"}}>Minimum Ticket Groupings: </p>
                <p style={{display: "inline", fontSize: "20px"}}>{this.props.minPurchaseSize}</p></div>)
        } else {
            arr.push(<p style={{display: "inline", fontSize: "20px", fontWeight: "bold"}}>Selling Tickets Individually</p>)
        }

        return arr;
    }

    renderSeatsValues() {

        var labels = [];
        if (this.props.seatsInfo.length > 0) {
            for (var i = 1; i <= this.props.numberOfTickets; i++) {

                var seat = this.props.seatsInfo[i - 1].seat[0].seatNum;
                var aisleCheck = this.props.seatsInfo[i - 1].seat[0].aisleSeat;
                var earlyEntryCheck = this.props.seatsInfo[i - 1].seat[0].earlyEntry;
                var handicapAccessibleCheck = this.props.seatsInfo[i - 1].seat[0].handicapAccessible;

                labels.push(
                    <Panel>
                        <div>
                            <Row>
                                <div className="globalCenterThis">
                                <Col lg={5}>
                                    <p style={{display: "inline", fontSize: "20px", fontWeight: "bold"}}>{"Seat Number " + i + ": "}</p>
                                    <p style={{display: "inline", fontSize: "20px"}}>{seat}</p>
                                </Col>
                                <Col lg={5}>
                                    <p style={{display: "inline", fontSize: "20px", fontWeight: "bold"}}>Ticket Extras</p>
                                    <div>
                                        <Row>
                                            {this.renderExtrasLabels(aisleCheck, earlyEntryCheck, handicapAccessibleCheck)}
                                        </Row>
                                    </div>
                                </Col>
                                </div>
                            </Row>
                        </div>
                    </Panel>
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
                    <Modal.Title><h2>New Listing Creation Review</h2></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h3>Please confirm all fields are correct before creating your listing.</h3>
                    <Grid>
                        <div>
                            <Panel style={{padding: "15px", width: "73.5%"}}>
                                <div className="globalCenterThis">
                                    <Row>
                                        <div className="globalCenterThis">
                                        <Col lg={8}>
                                            <p style={{fontSize: "20px", fontWeight: "bold"}}>Game Date: </p>
                                            <p style={{fontSize: "20px"}}><Time value={this.props.dbGameDate} format="MMMM D, YYYY h:mmA"/></p>
                                        </Col>
                                        <Col lg={8}>
                                            <p style={{display: "inline", fontSize: "20px", fontWeight: "bold"}}>Opponent Name: </p>
                                            <p style={{display: "inline", fontSize: "20px"}}>{this.props.opponentName}</p>
                                        </Col>
                                        </div>
                                    </Row>
                                </div>
                            </Panel>
                            <Panel style={{padding: "15px", width: "73.5%"}}>
                                <div><Panel>
                                    <Row>
                                        <div className="globalCenterThis">
                                        <Col lg={5}>
                                            <p style={{display: "inline", fontSize: "20px", fontWeight: "bold"}}>Section Number: </p>
                                            <p style={{display: "inline", fontSize: "20px"}}>{this.props.section}</p>
                                        </Col>
                                        <Col lg={5}>
                                            <p style={{display: "inline", fontSize: "20px", fontWeight: "bold"}}>Row Number: </p>
                                            <p style={{display: "inline", fontSize: "20px"}}>{this.props.row}</p>
                                        </Col>
                                        </div>
                                    </Row>
                                </Panel>
                                    <Row style={{paddingBottom: "20px"}}>
                                        {this.renderSeatsValues()}
                                    </Row>
                                </div>
                            </Panel>
                            <Panel style={{padding: "15px", width: "73.5%"}}>
                                <div>
                                    <Row>
                                        <div className="globalCenterThis">
                                        <Col lg={5}>
                                            {this.displayGroupSizeLabel()}
                                        </Col>
                                        <Col lg={5}>
                                            <p style={{display: "inline", fontSize: "20px", fontWeight: "bold"}}>Price Per Ticket: </p>
                                            <p style={{display: "inline", fontSize: "20px"}}>${this.props.ticketPrice}</p>
                                        </Col>
                                        </div>
                                    </Row>
                                </div>
                            </Panel>
                        </div>
                    </Grid>
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
